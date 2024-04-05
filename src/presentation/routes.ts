import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './products/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes); // seria como la ruta padre --> /api/todos/login etc
    router.use('/api/categories', CategoryRoutes.routes)
    router.use('/api/products', ProductRoutes.routes)



    return router;
  }


}

