import { RegisterUserDTO, CreateUserDTO, UpdateUserDTO, User, UpdatePaymentInfoDTO, UpdatePersonalInfoDTO, PaymentInfo, Order } from "@/lib/types/user";
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
            client.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => {
            notify.error("Falha ao criar conta.")
        }
    })
}

/*
Função para atualizar um usuário e seu hook
*/
export async function updatePersonalInfo(id: string, user: UpdatePersonalInfoDTO): Promise<boolean> {
    const response = await api.put<boolean>(`/users/update-info/${id}`, {...user, id});
    if (response.status !== 201) {
        throw new Error("Failed to update user information");
    }

    return response.data;
}

export function useUpdatePersonalInfo() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "userInfo"],
        mutationFn: ({ id, user }: { id: string, user: UpdatePersonalInfoDTO }) => updatePersonalInfo(id, user),
        onSuccess: () => {
            notify.success("Informações pessoais atualizadas com sucesso.");
            client.invalidateQueries({ queryKey: ["usersInfo"] });
        },
        onError: () => {
            notify.error("Falha ao atualizar informações pessoais.")
        }
    })
}

/*
Função para atualizar informações de pagamento de um usuário e seu hook
*/
export async function updatePaymentInfo(id: string, paymentInfo: UpdatePaymentInfoDTO): Promise<boolean> {
    const response = await api.put<boolean>(`/users/update-payment/${id}`, {...paymentInfo, id});
    if (response.status !== 201) {
        throw new Error("Failed to update payment information");
    }

    return response.data;
}

export function useUpdatePaymentInfo() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "payment"],
        mutationFn: ({ id, payment }: { id: string, payment: UpdatePaymentInfoDTO }) => updatePaymentInfo(id, payment),
        onSuccess: () => {
            notify.success("Informações de pagamento atualizadas com sucesso.");
            client.invalidateQueries({ queryKey: ["payment"] });
        },
        onError: () => {
            notify.error("Falha ao atualizar informações de pagamento.")
        }
    })
}


/*
Função para buscar informações de pagamento por id de usuário e seu hook
*/

async function fetchPaymentInfoById(id: string | null): Promise<PaymentInfo | undefined> {
    if(id == null) return

    const response = await api.get<PaymentInfo>(`/user/payment-info/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user!");
    }

    return response.data;
}

export function useFetchPaymentInfoById(id: string | null, options?: UseQueryOptions) {
    return useQuery({
        queryKey: ["payment"],
        queryFn: () => fetchPaymentInfoById(id),
        enabled: options?.enabled,
        ...options
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
            client.invalidateQueries({ queryKey: ["user"] });
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
            client.invalidateQueries({ queryKey: ["user"] });
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
/*
Função para buscar pedidos por id de usuário e seu hook
*/

async function fetchOrdersById(id: string): Promise<Order[] | undefined> {
    const response = await api.get<Order[]>(`/user/orders/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch orders!");
    }

    return response.data;
}

export function useFetchOrdersById(id: string) {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => fetchOrdersById(id)
    })
}