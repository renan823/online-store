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
    isAdmin: z.boolean(),
});

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