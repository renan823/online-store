import { LoginResponse, User, UserCredentials } from "@/lib/types/user";
import { useLogin } from "@/services/user.service";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextType {
    login: (credentials: UserCredentials) => void;
    logout: () => void;
    user: User | null;
    token: string | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const doLogin = useLogin()

    function login(credentials: UserCredentials, redirect: Function) {
        doLogin.mutate(credentials, {
            onSuccess: (response) => {
                setUser(response.payload.user);
                setToken(response.token);
                redirect()
            },
        });
    }

    function logout() {
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ login, logout, user, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return context;
}