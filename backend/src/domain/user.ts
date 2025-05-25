export type UserRole = "admin" | "user";

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: UserRole;
}

export type UserPayment = {
    id: string;
    userId: string;
    name: string;
    number: string;
}