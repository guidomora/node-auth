import { envs } from "../../config"
import { CategoryModel } from "../mongoDB/models/category.model"
import { ProductModel } from "../mongoDB/models/product.model"
import { UserModel } from "../mongoDB/models/user.model"
import { MongoDatabase } from "../mongoDB/mongo-database" 
import { seedData } from "./data"

// Este archivo se ejecuta con el npm run seed y sirve para poblar la base de datos con datos de prueba


(async()=> {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })
    await main()
    await MongoDatabase.disconnect()
})()

const randomBetween0AndX = (x: number) => {
    return Math.floor(Math.random() * x); // si mando 10, me devuelve un número entre 0 y 9
}

async function main() {
    await Promise.all([ // array de promesas

        // Borramos todo
        UserModel.deleteMany(),
        CategoryModel.deleteMany(), 
        ProductModel.deleteMany(), 
    ])

    // Insertamos los usuarios
    const users = await UserModel.insertMany(seedData.users)

    // Insertamos las categorías
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => {
           return {
                ...category,
                user: users[0]._id
           } 
        })
    )

    // Insertamos los productos
    const products = await ProductModel.insertMany(
        seedData.products.map(product => {
            return {
                ...product,
                user: users[randomBetween0AndX(seedData.users.length -1) ]._id, // -1 porque el array de usuarios empieza en 0
                category: categories[randomBetween0AndX(categories.length -1)]._id
            }
        
        })
    )
     
    console.log('SEEDED');
    
}