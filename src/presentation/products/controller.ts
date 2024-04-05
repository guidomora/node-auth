import { Request, Response } from "express";
import { CustomError} from "../../domain";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { ProductService } from "../services/product.service";


export class ProductController {
    // inyeccion de dependencias
    constructor(
        private readonly productService: ProductService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'internal server error' });
    }

    // Express recomienda que no pongamos async await dentro de los controllers
    createProduct =  (req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create({ // como la req tiene la info del usuario, la pasamos al createProductDto
            ...req.body,
            user: req.body.user.id
        });
        if (error) return res.status(400).json({ error });
        // res.json(req.body); // solo para probar, podemos ver que trae toda la info del usuario + el token
        this.productService.createProduct(createProductDto!)
            .then(products => res.status(201).json(products))
            .catch(error => this.handleError(error, res));
    }

    getProducts = async (req: Request, res: Response) => {
        const {page=1, limit=10} = req.query; // si no viene nada, por defecto page=1 y limit=10
        const [error, paginationDto] = PaginationDto.create(+page, +limit); // al poner el + delante de la variable, la convierte a number
        if (error) return res.status(400).json({ error });

        this.productService.getProducts(paginationDto!) // el ! es para decirle a typescript que no puede ser null
            .then(products => res.status(200).json(products))
            .catch(error => this.handleError(error, res));

        return res.json('getProducts');
    }
}