import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';





export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getCategories);
    router.post('/', [AuthMiddleware.validateJWT], controller.createCategory); // el middleware se ejecuta antes de la funcion, tiene [] porque es un array de middlewares, si queremos agregar mas de uno se los agregamos ahi



    return router;
  }


}

