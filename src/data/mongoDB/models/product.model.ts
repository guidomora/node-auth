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

productSchema.set('toJSON', { // para que cuando devuelva el objeto como un json no devuelva el _id y la version 
    virtuals: true, // para que devuelva los campos virtuales
    versionKey: false, // para que no devuelva la version "__v:0"
    transform: function(doc, ret, options) {
        delete ret._id; // para que no devuelva el _id de mongo
    }
})

export const ProductModel = mongoose.model('Product', productSchema)