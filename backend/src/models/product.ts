import * as mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    brand: {type: String, required: true},
    quantityStock: {type: Number, required: true},
    price: {type: Number, required: true},
    discount: {type: Number, required: true},
    quantitySold: {type: Number, required: true},
    images: {type: [String], required: true},
    deleted: { type:Boolean, default: false }
});

export const ProductModel = mongoose.model('Product', productSchema);