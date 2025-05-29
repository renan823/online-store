import { User, UserCredentials } from "@/lib/types/user";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
    login: (credentials: UserCredentials) => void;
    logout: () => void;
    user: User | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    function login(credentials: UserCredentials) {
        setUser({
            id: "q4234234",
            name: "Joãozinho",
            email: credentials.email,
            role: "admin"
        })
    }

    function logout() {
        console.log("logout");
    }

    return (
        <AuthContext.Provider value={{ login, logout, user }}>
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