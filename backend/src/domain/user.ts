import z from "zod";

export type UserRole = "admin" | "user";

export type User = {
    id: string;
    name: string;
    password?: string;
    email: string;
    phone: string;
    address: string;
    role: UserRole;
}

export type CreateUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export type UpdateUserDTO = {
    id: string,
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export const CreateUserSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    password: z.string(),
    isAdmin: z.boolean(),
});

export const UpdateUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    password: z.string(),
    isAdmin: z.boolean(),
});
