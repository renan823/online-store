import { CreateUserDTO, User } from "../../domain/user";
import { UserSchema } from "../../models/user";

// Caso de uso: criar novo usuário
export async function createUserUseCase(data: CreateUserDTO): Promise<boolean> {
    try {
        let user: User
        if(data.isAdmin){
            const {isAdmin: _, ...newUser} = data
            user = { id: crypto.randomUUID(), role: "admin", ...newUser }
        } else {
            const {isAdmin: _, ...newUser} = data
            user = { id: crypto.randomUUID(), role: "user", ...newUser }
        }

        await UserSchema.create(user);
        return true;
    } catch {
        return false;
    }
}

