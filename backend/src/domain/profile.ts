import z from "zod";

export type RegisterUserDTO = {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export const RegisterUserSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    password: z.string(),
});

export type PaymentInfo = {
    cardHolderName: string;
    cardNumber: string;
}

export type UpdatePaymentInfoDTO = {
    id: string;
    cardHolderName: string;
    cardNumber: string;
}

export const UpdatePaymentSchema = z.object({
    id: z.string(),
    cardHolderName: z.string(),
    cardNumber: z.string(),
});

export type UpdatePersonalDTO = {
    id: string,
    name: string;
    address: string;
    phone: string;
}

export const UpdatePersonalSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
});
