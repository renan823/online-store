import { UserSchema } from "../../models/user";

// Caso de uso: remover produto (soft delete)
export async function deleteUserUseCase(id: string): Promise<boolean> {
    const result = await UserSchema.findOneAndUpdate(
        { id, deleted: { $ne: true } }, 
        { $set: { deleted: true } }
    );

    return result !== null;
}
