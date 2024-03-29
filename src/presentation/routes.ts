import { Router } from 'express';
import { AuthRoutes } from './auth/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes); // seria como la ruta padre --> /api/todos/login etc



    return router;
  }


}

