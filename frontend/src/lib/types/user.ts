import { z } from "zod";

export type LoginResponse = {
    payload: {
        user: User,
        exp: Number
    },
    token: string
}


export interface UserCredentials {
    email: string;
    password: string;
}

export type UserRole = "admin" | "user";

export interface User {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    role: UserRole;
}

export type RegisterUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export type CreateUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export const CreateUserSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    isAdmin: z.boolean()
})

export type UpdateUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    isAdmin: boolean;
}

export const UpdateUserSchema = z.object({
    name: z.string().min(1, "Esse campo é obrigatório."),
    phone: z.string().min(1, "Esse campo é obrigatório."),
    address: z.string().min(1, "Esse campo é obrigatório."),
    email: z.string().email('Email inválido'),
    isAdmin: z.boolean()
})

export type UpdatePersonalInfoDTO = {
    name: string;
    address: string;
    phone: string;
}

export const UpdatePersonalInfoSchema = z.object({
    name: z.string().min(1, "Esse campo é obrigatório."),
    phone: z.string().min(1, "Esse campo é obrigatório."),
    address: z.string().min(1, "Esse campo é obrigatório."),
})


export type UpdatePaymentInfoDTO = {
    cardHolderName: string;
    cardNumber: string;
}
export type PaymentInfo = UpdatePaymentInfoDTO

export const UpdatePaymentInfoSchema = z.object({
    cardHolderName: z.string().min(1, "Esse campo é obrigatório."),
    cardNumber: z.string().min(1, "Esse campo é obrigatório.")
})

export type OrderStatus = "Entregue" | "Cancelado" | "Transporte" | "Pendente";

export type Order = {
    id: number,
    value: number,
    productDetails: string,
    status: OrderStatus
}