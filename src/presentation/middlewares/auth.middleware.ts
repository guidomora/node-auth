import { NextFunction, Request, Response } from "express";
import { JwvAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
   static async validateJWT(req:Request, res:Response, next:NextFunction) { //next sirve para que si todo sale ok continue con la siguiente funcion
      
    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid token' }); // si no empieza con Bearer es invalido

    const token = authorization.split(' ').at(1) || ''; // separamos el token del bearer

    try {
        const payload = await JwvAdapter.validateToken<{id:string}>(token); // aclaramos que el payload es un objeto con un id
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        const user = await UserModel.findById(payload.id);
        if (!user) return res.status(401).json({ error: 'Invalid token - user' });
        req.body.user = UserEntity.fromObject(user); // guardamos el usuario en el body
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server error' });
    }

   }
}