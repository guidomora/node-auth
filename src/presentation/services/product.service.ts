import { CategoryModel } from "../../data/mongoDB/models/category.model";
import { ProductModel } from "../../data/mongoDB/models/product.model";
import { CustomError, UserEntity } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";

export class ProductService {
    constructor() { }

    async createProduct(createProductDto: CreateProductDto) {
        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if (productExists) throw CustomError.badRequest('Category already exists');

        try {
            const product = new ProductModel({
                ...createProductDto,
            })
            await product.save();
            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const totalProducts = await ProductModel.countDocuments(); // contar la cantidad de registros
            const products = await ProductModel.find()
                // saltar una cantidad de registros, arranca en 0 por defecto (el 0 seria la pagina 1), por eso restamos 1
                .skip((page - 1) * limit) // se multiplica por el limite para que salte la cantidad de registros que queremos
                .limit(limit) // limitamos la cantidad de registros que nos devuelve
                .populate('user') // para que nos devuelva toda la info del usuario relacionada con el producto

            return {
                page, // devolvemos la pagina actual
                limit, // devolvemos el limite de registros por pagina
                total: totalProducts, // devolvemos la cantidad total de registros
                next: `/api/products?page=${(page + 1)}&limit=${limit}`, // devolvemos la url de la siguiente pagina
                previous: (page-1 > 0) ? `/api/products?page=${(page - 1)}&limit=${limit}` : null, // devolvemos la url de la pagina anterior
                // envolvemos toda la info de las products en un objeto categories
                products: products
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}