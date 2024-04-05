import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from '../products/controller';
import { ProductService } from '../services/product.service';






export class ProductRoutes {


  static get routes(): Router {

    const router = Router();
    const categoryService = new ProductService();
    const controller = new ProductController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getProducts);
    router.post('/', [AuthMiddleware.validateJWT], controller.createProduct); // el middleware se ejecuta antes de la funcion, tiene [] porque es un array de middlewares, si queremos agregar mas de uno se los agregamos ahi


    return router;
  }


}

