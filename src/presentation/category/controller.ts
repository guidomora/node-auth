import { Request, Response } from "express";
import { CustomError} from "../../domain";
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from "../services/category.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";


export class CategoryController {
    // inyeccion de dependencias
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'internal server error' });
    }

    // Express recomienda que no pongamos async await dentro de los controllers
    createCategory =  (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if (error) return res.status(400).json({ error });
        // res.json(req.body); // solo para probar, podemos ver que trae toda la info del usuario + el token
        this.categoryService.createCategory(createCategoryDto!, req.body.user)
            .then(category => res.status(201).json(category))
            .catch(error => this.handleError(error, res));
    }

    getCategories = async (req: Request, res: Response) => {
        const {page=1, limit=10} = req.query; // si no viene nada, por defecto page=1 y limit=10
        const [error, paginationDto] = PaginationDto.create(+page, +limit); // al poner el + delante de la variable, la convierte a number
        if (error) return res.status(400).json({ error });

        this.categoryService.getCategories(paginationDto!) // el ! es para decirle a typescript que no puede ser null
            .then(categories => res.status(200).json(categories))
            .catch(error => this.handleError(error, res));
    }
}