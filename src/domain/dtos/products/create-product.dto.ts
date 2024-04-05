import { Validators } from "../../../config/validators";

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, //id
        public readonly category: string, //id de la categoria
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
        const { name, available, price, description, user, category } = props;

        if (!name) return ['name is required'];
        if (!user) return ['user is required'];
        if (!category) return ['category is required'];
        if (!Validators.isMongoID(user)) return ['user is invalid'];
        if (!Validators.isMongoID(category)) return ['category is invalid'];

        return [undefined, new CreateProductDto(name, !!available, price, description, user, category)]; // la doble negacion convierte a booleano, si viene algo  es true, si no viene nada es false

    }
}