import { RegisterUserDTO, CreateUserDTO, UpdateUserDTO, User, UpdatePaymentInfoDTO, UpdatePersonalInfoDTO, PaymentInfo, Order, UserCredentials, LoginResponse } from "@/lib/types/user";
import { api } from "./config";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { notify } from "@/lib/notify";

/*
Função logar um usuário e seu hook
*/
export async function login(credentials: UserCredentials): Promise<LoginResponse | undefined> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    console.log(response)
    if (response.status !== 200) {
        throw new Error("Failed to login user!");
    }

    return response.data;
}

export function useLogin() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["login", "user"],
        mutationFn: login,
        onSuccess: () => {
            notify.success("Login efetuado com sucesso.");
            client.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => {
            notify.error("Falha ao efetuar login.")
        }
    })
}

/*
Função para registrar um usuário e seu hook
*/
export async function registerUser(user: RegisterUserDTO): Promise<boolean> {
    const response = await api.post<boolean>("/auth/register", user);
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
export async function updatePersonalInfo(id: string, user: UpdatePersonalInfoDTO, token: string): Promise<boolean> {
    const response = await api.put<boolean>(`/profiles`, {...user, id}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update user information");
    }

    return response.data;
}

export function useUpdatePersonalInfo() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "userInfo"],
        mutationFn: ({ id, user, token }: { id: string, user: UpdatePersonalInfoDTO, token: string }) => updatePersonalInfo(id, user, token),
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
export async function updatePaymentInfo(id: string, paymentInfo: UpdatePaymentInfoDTO, token: string): Promise<boolean> {
    const response = await api.put<boolean>(`/profiles/payment`, {...paymentInfo, id}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update payment information");
    }

    return response.data;
}

export function useUpdatePaymentInfo() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "payment"],
        mutationFn: ({ id, payment, token }: { id: string, payment: UpdatePaymentInfoDTO, token: string }) => updatePaymentInfo(id, payment, token),
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

async function fetchPaymentInfoById(id: string | null, token: string): Promise<PaymentInfo | undefined> {
    if(id == null) return

    const response = await api.get<PaymentInfo>(`/profiles/payment/${id}`, {
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user!");
    }

    return response.data;
}

export function useFetchPaymentInfoById(id: string | null, token: string, options?: UseQueryOptions) {
    return useQuery({
        queryKey: ["payment"],
        queryFn: () => fetchPaymentInfoById(id, token),
        enabled: options?.enabled,
        ...options
    })
}

/*
Função para criar um usuário e seu hook
*/
export async function createUser(user: CreateUserDTO, token: string): Promise<boolean> {
    const response = await api.post<boolean>("/users/new", user, {
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 201) {
        throw new Error("Failed to create user");
    }

    return response.data;
}

export function useCreateUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["create", "user"],
        mutationFn: ({ user, token }: { user: CreateUserDTO, token: string }) => createUser(user, token),
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
export async function deleteUser(id: string, token: string): Promise<boolean> {
    const response = await api.delete<boolean>(`/users/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete user!");
    }

    return response.data;
}

export function useDeleteUser() {
    return useMutation({
        mutationKey: ["delete", "user"],
        mutationFn: ({ id, token }: { id: string, token: string }) => deleteUser(id, token),
        onSuccess: () => {
            notify.success("Usuário deletado.");
        },
        onError: () => notify.error("Falha ao deletar usuário.")
    })
}

/*
Função para atualizar um usuário e seu hook
*/
export async function updateUser(id: string, user: UpdateUserDTO, token: string): Promise<boolean> {
    const response = await api.put<boolean>("/users", {...user, id}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update user");
    }

    return response.data;
}

export function useUpdateUser() {
    const client = useQueryClient();

    return useMutation({
        mutationKey: ["update", "user"],
        mutationFn: ({ id, user, token }: { id: string, user: UpdateUserDTO, token: string }) => updateUser(id, user, token),
        onSuccess: () => {
            notify.success("Usuário atualizado com sucesso.");
            client.invalidateQueries({ queryKey: ["update", "user"] });
        },
        onError: () => {
            notify.error("Falha ao atualizar usuário.")
        }
    })
}

/*
Função para buscar um usuário por id e seu hook
*/
async function fetchUserById(id: string, token: string): Promise<User | undefined> {
    const response = await api.get<User>(`/users/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user!");
    }

    return response.data;
}

export function useFetchUserById(id: string, token: string, options?: UseQueryOptions) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(id, token),
        enabled: options?.enabled,
        ...options
    })
}

/* 
Função para buscar usuários com filtro e seu hook
*/
async function fetchUsers(token: string): Promise<User[]> {
    const response = await api.get<User[]>("/users?search=", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch users!");
    }

    return response.data;
}

export function useFetchUsers(token: string, dependency: boolean) {
    return useQuery({
        queryKey: ["users", dependency],
        queryFn: () => fetchUsers(token)
    })
}
/*
Função para buscar pedidos por id de usuário e seu hook
*/

async function fetchOrdersById(id: string, token: string): Promise<Order[] | undefined> {
    const response = await api.get<Order[]>(`/user/orders/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch orders!");
    }

    return response.data;
}

export function useFetchOrdersById(id: string, token: string) {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => fetchOrdersById(id, token)
    })
}