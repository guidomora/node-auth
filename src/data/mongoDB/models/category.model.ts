import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is required" ], // el string es un mensaje de error
        unique: true
    },
    available:{
        type:Boolean,
        default: false
    },
    user:{
        type: Schema.Types.ObjectId, // obliga a que sea un id de mongo
        ref: 'User', // referencia a la coleccion de usuarios
        required: true
    }
});

export const CategoryModel = mongoose.model('Category', categorySchema)