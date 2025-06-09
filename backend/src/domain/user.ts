export type UserRole = "admin" | "user";

export type User = {
    id: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    address?: string;
    role: UserRole;
}