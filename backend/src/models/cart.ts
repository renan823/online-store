import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    updatedAt: { type: Date, default: Date.now },
    deleted: { type:Number, default: false }
})

export const CartSchema = mongoose.model("Cart", cartSchema);