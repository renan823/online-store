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

export type CreateUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}