import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: String, ref: 'User' },
    items: [{
        product: {
            _id: mongoose.Schema.Types.ObjectId,
            id: String,
            name: String,
            price: Number
        },
        quantity: Number
    }],
    total: Number,
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    payment: {
        method: String,
        paidAt: Date,
        transactionId: String
    },
    deleted: { type:Boolean, default: false }
});

export const OrderModel = mongoose.model('Order', orderSchema);