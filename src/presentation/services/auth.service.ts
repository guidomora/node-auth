import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    constructor(
    ){}
    public async registerUser  (registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({email: registerUserDto.email}); // busca si existe el usuario
        if (existUser) throw CustomError.badRequest('email already exists');

        // guardado en DB
        try {
            const user = new UserModel(registerUserDto);
            await user.save();
            // encriptar password
            //  JWT
            // enviar email de validacion

            const {password, ...userEntity } = UserEntity.fromObject(user) // quitar el password
            return { user: userEntity, token: 'token' };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}