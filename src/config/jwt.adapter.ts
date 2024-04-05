import jwt from 'jsonwebtoken';
import { envs } from './envs';

const SEED = envs.JWT_SEED;

export class JwvAdapter {
    static async generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {

            jwt.sign(payload, SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null)
                resolve(token)
            })
        })
    }
    static validateToken<T>(token: string):Promise<T | null> { // el T es para que typescript sepa que es un tipo generico (puede ser cualquier cosa)
        return new Promise((resolve) => {
            jwt.verify(token, SEED, (err, decoded) => { // el decoded es el payload
                if (err) return resolve(null) // si hay error la promesa siempre se resuelve pero con null
                resolve(decoded as T)
            })
        })
    }
}