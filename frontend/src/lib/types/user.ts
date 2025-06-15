import { z } from "zod";

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
    name: z.string(),
    phone: z.string(),
    address: z.string(),
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
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    email: z.string().email('Email inválido'),
    isAdmin: z.boolean()
})