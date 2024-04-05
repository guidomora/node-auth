import { CategoryModel } from "../../data/mongoDB/models/category.model";
import { CustomError, UserEntity } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";

export class CategoryService {
    constructor() { }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (categoryExists) throw CustomError.badRequest('Category already exists');

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })
            await category.save();
            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const totalCategories = await CategoryModel.countDocuments(); // contar la cantidad de registros
            const categories = await CategoryModel.find()
                // saltar una cantidad de registros, arranca en 0 por defecto (el 0 seria la pagina 1), por eso restamos 1
                .skip((page - 1) * limit) // se multiplica por el limite para que salte la cantidad de registros que queremos
                .limit(limit) // limitamos la cantidad de registros que nos devuelve

            return {
                page, // devolvemos la pagina actual
                limit, // devolvemos el limite de registros por pagina
                total: totalCategories, // devolvemos la cantidad total de registros
                next: `/api/categories?page=${(page + 1)}&limit=${limit}`, // devolvemos la url de la siguiente pagina
                previous: (page-1 > 0) ? `/api/categories?page=${(page - 1)}&limit=${limit}` : null, // devolvemos la url de la pagina anterior
                // envolvemos toda la info de las categorias en un objeto categories
                categories: categories.map(category => ({ // mapeamos para que nos devuelva solo los campos que queremos, sino mongo de teduelve toda la info
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}