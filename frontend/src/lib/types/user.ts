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

const validadeRegex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;

export const PaymentCardSchema = z.object({
    name: z.string()
        .min(2, "Nome muito curto")
        .max(100, "Nome muito longo"),

    number: z.string()
        .regex(/^\d{16}$/, "Número do cartão deve conter 16 dígitos numéricos"),

    cvv: z.string()
        .regex(/^\d{3,4}$/, "CVV deve conter 3 ou 4 dígitos"),

    expiration: z.string()
        .regex(validadeRegex, "Formato inválido (esperado MM/AA ou MM/AAAA)")
        .refine((val) => {
            const [mesStr, anoStr] = val.split('/');
            const mes = parseInt(mesStr, 10);
            let ano = parseInt(anoStr, 10);
            if (anoStr.length === 2) {
                // Corrige para ano completo
                const currentYear = new Date().getFullYear();
                const prefix = Math.floor(currentYear / 100) * 100;
                ano += prefix;
            }

            const validadeData = new Date(ano, mes); // fim do mês
            const agora = new Date();
            return validadeData > agora;
        }, {
            message: "Cartão expirado",
        }),
});
