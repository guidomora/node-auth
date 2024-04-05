// objeto para verificar el body y transformarlo a algo que podamos controlar

export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ){}

    static create(object:{[key:string]:any}):[string?, CreateCategoryDto?]{ // [en caso de que haya un error --> string, sino el value]
        const {name, available=false} = object; // si no se recibe el available, se asigna false
        let availableBoolean = available;

        if(!name) return ['Name is required'];
        if (typeof available !== 'boolean') { // si no es un booleano
            availableBoolean = ( available === 'true' ) // si es true, se asigna true, sino false
        }

        return[undefined, new CreateCategoryDto(name, availableBoolean)] // no hay error (undefined), se crea el objeto
    }
}