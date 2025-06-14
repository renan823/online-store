import { CreateUserDTO } from "@/lib/types/user";
import { api } from "./config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/lib/notify";

/*
Função para criar um usuário e seu hook
*/
export async function createUser(user: CreateUserDTO): Promise<boolean> {
    let response = await api.post<boolean>("/user/new", user);
    if (response.status !== 201) {
        throw new Error("Failed to create user!");
    }

    return response.data;
}

export function useCreateUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["create", "user"],
        mutationFn: createUser,
        onSuccess: () => {
            notify.success("Usuário criado.");
            client.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notify.error("Falha ao criar o usuário.")
        }
    })
}