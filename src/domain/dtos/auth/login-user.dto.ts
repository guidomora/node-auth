import { regularExps } from "../../../config";

export class LoginUserDto {
    
    private constructor (
        public email: string,
        public password: string,
    ){}

    static login(object:{[key:string]:any} ): [string?, LoginUserDto?] {
        const { email, password } = object;
        
        if (!email) return ['name is required', undefined];
        if (!regularExps.email.test(email)) return ['email is not valid']; // hace la validacion de que sea un email
        if (!password) return ['password is required'];
        if (password.length < 6) return ['password must be at least 6 characters'];

        // si pasa todas las validaciones
        return [undefined, new LoginUserDto(email, password)];
    }
}