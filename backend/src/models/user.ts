import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    role: {type: String, enum: ["admin", "user"], default: "user"},
    cardHolderName: {type: String, required: false},
    cardNumber: {type: String, required: false},
    deleted: { type:Number, default: false }
});

//export type User = mongoose.InferSchemaType<typeof userSchema>;
export const UserSchema = mongoose.model('User', userSchema);