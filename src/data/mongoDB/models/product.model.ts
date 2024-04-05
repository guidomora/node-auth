import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is required" ], // el string es un mensaje de error
        unique: true
    },
    available:{
        type:Boolean,
        default: false
    },
    price:{
        type:Number,
        default: 0
    },
    description:{
        type:String
    },
    user:{
        type: Schema.Types.ObjectId, // obliga a que sea un id de mongo
        ref: 'User', // referencia a la coleccion de usuarios
        required: true
    },
    category:{
        type:Schema.Types.ObjectId, // obliga a que sea un id de mongo
        ref: 'Category',
        required: true
    }
});

export const ProductModel = mongoose.model('Product', productSchema)