import { bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { JwvAdapter } from '../../config/jwt.adapter';
import { EmailService } from './email.service';

export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ){}
    public async registerUser  (registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({email: registerUserDto.email}); // busca si existe el usuario
        if (existUser) throw CustomError.badRequest('email already exists');

        // guardado en DB
        try {
            const user = new UserModel(registerUserDto);
            // encriptar password
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            //  JWT
            // enviar email de validacion
            await this.sendEmailValidationLink(user.email);

            const {password, ...userEntity } = UserEntity.fromObject(user) // quitar el password

            const token = await JwvAdapter.generateToken({id: user.id});
            if (!token) throw CustomError.internalServer('error generating token');

            return { user: userEntity, token };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser (loginUserDto:LoginUserDto){
        const existUser = await UserModel.findOne({email: loginUserDto.email});
        if (!existUser) throw CustomError.badRequest('email or password does not exist');
        const isMatch = bcryptAdapter.compare(loginUserDto.password, existUser.password);
        if (!isMatch) throw CustomError.badRequest('email or password does not exist');

        const {password, ...userEntity } = UserEntity.fromObject(existUser) // quitar el password

        const token = await JwvAdapter.generateToken({id: existUser.id});
        if (!token) throw CustomError.internalServer('error generating token');

        return {
            user:userEntity,
            token
        }
    }

    private sendEmailValidationLink = async (email: string) => {
        // usamos un jwt pero podria ser un uuid o lo que fuese
        const token = await JwvAdapter.generateToken({email}); // le mandamos en el payload el email del usuario
        if (!token) throw CustomError.internalServer('error generating token'); // si no se genero el token, esto igual no deberia fallar

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`; // link de validacion
        const html = `<h1>Validate your email</h1>
        <p>Click on the following link to validate your email: ${email}</p>
        <a href="${link}">validate</a>`; // html del email


        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServer('error sending email');
        return true
    }

    public validateEmail = async (token: string) => {
        const payload = await JwvAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('invalid token');

        const { email } = payload as {email: string}; // como el payload viene con un tipado any, lo casteamos a un objeto con la propiedad email
        if (!email) throw CustomError.internalServer('email not found in token');

        const user = await UserModel.findOne({email});
        if (!user) throw CustomError.badRequest('user not found');

        user.emailValidated = true; // validamos el email
        await user.save();
        return true;
    }
        
}