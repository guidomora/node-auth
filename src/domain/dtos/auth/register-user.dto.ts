import { regularExps } from "../../../config";

export class RegisterUserDto {
    
    private constructor (
        public name: string,
        public email: string,
        public password: string,
    ){}

    static create(object:{[key:string]:any} ): [string?, RegisterUserDto?] {
        const {name, email, password } = object;

        
        if (!name) return ['name is required', undefined];
        if (!email) return ['name is required', undefined];
        if (!regularExps.email.test(email)) return ['email is not valid']; // hace la validacion de que sea un email
        if (!password) return ['password is required'];
        if (password.length < 6) return ['password must be at least 6 characters'];

        // si pasa todas las validaciones
        return [undefined, new RegisterUserDto(name, email, password)];
    }
}