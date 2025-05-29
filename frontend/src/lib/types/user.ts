export interface UserCredentials {
    email: string;
    password: string;
}

export type UserRole = "admin" | "user";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}