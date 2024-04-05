import { compareSync, genSaltSync, hashSync } from "bcryptjs"


export const bcryptAdapter = {
    hash:(password: string) => {
        const salt = genSaltSync(); // genera un salt de 10 vueltas
        return hashSync(password, salt); // encripta el password
    },
    compare: (password: string, hash: string) => { // recibe la password que el usuario envia y el hash de la DB
        return compareSync(password, hash); // compara la password con el hash
    }
}