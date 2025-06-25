import { User, UserCredentials } from "@/lib/types/user";
import { useLogin } from "@/services/user.service";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextType {
    login: (credentials: UserCredentials) => void;
    logout: () => void;
    update: (name: string, phone: string, address: string) => void
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
    
    function update(name: string, phone: string, address: string){
        const updatedUser = {...user}
        updatedUser.name = name
        updatedUser.phone = phone
        updatedUser.address = address
        
        setUser(updatedUser as User)
    }

    return (
        <AuthContext.Provider value={{ login, logout, update, user, token }}>
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