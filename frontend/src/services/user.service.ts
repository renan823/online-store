import { RegisterUserDTO, CreateUserDTO, UpdateUserDTO, User } from "@/lib/types/user";
import { api } from "./config";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { notify } from "@/lib/notify";

/*
Função para registrar um usuário e seu hook
*/
export async function registerUser(user: RegisterUserDTO): Promise<boolean> {
    const response = await api.post<boolean>("/users/register", user);
    if (response.status !== 201) {
        throw new Error("Failed to register user");
    }

    return response.data;
}

export function useRegisterUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["create", "user"],
        mutationFn: registerUser,
        onSuccess: () => {
            notify.success("Conta criada com sucesso.");
            client.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notify.error("Falha ao criar conta.")
        }
    })
}


/*
Função para criar um usuário e seu hook
*/
export async function createUser(user: CreateUserDTO): Promise<boolean> {
    const response = await api.post<boolean>("/users/new", user);
    if (response.status !== 201) {
        throw new Error("Failed to create user");
    }

    return response.data;
}

export function useCreateUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["create", "user"],
        mutationFn: createUser,
        onSuccess: () => {
            notify.success("Usuário criado com sucesso.");
            client.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notify.error("Falha ao criar usuário.")
        }
    })
}

/*
Função para deletar um usuário e seu hook
*/
export async function deleteUser(id: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/users/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to delete user!");
    }

    return response.data;
}

export function useDeleteUser() {
    return useMutation({
        mutationKey: ["delete", "user"],
        mutationFn: deleteUser,
        onSuccess: () => {
            notify.success("Usuário deletado.");
        },
        onError: () => notify.error("Falha ao deletar usuário.")
    })
}

/*
Função para atualizar um usuário e seu hook
*/
export async function updateUser(id: string, user: UpdateUserDTO): Promise<boolean> {
    const response = await api.put<boolean>(`/users/update/${id}`, {...user, id});
    if (response.status !== 201) {
        throw new Error("Failed to update user");
    }

    return response.data;
}

export function useUpdateUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "user"],
        mutationFn: ({ id, user }: { id: string, user: UpdateUserDTO }) => updateUser(id, user),
        onSuccess: () => {
            notify.success("Usuário atualizado com sucesso.");
            client.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            notify.error("Falha ao atualizar usuário.")
        }
    })
}

/*
Função para buscar um usuário por id e seu hook
*/
async function fetchUserById(id: string): Promise<User | undefined> {
    const response = await api.get<User>(`/user/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user!");
    }

    return response.data;
}

export function useFetchUserById(id: string, options?: UseQueryOptions) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(id),
        enabled: options?.enabled,
        ...options
    })
}

/* 
Função para buscar usuários com filtro e seu hook
*/
async function fetchUsers(): Promise<User[]> {
    const response = await api.get<User[]>(`/users`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch users!");
    }

    return response.data;
}

export function useFetchUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers()
    })
}