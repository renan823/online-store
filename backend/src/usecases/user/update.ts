import { ProjectionFields } from "mongoose";
import { User, UpdateUserDTO } from "../../domain/user";
import { UserSchema } from "../../models/user";

// Use case: update user's data
export async function updateUserUseCase(data: UpdateUserDTO): Promise<User | null> {
    let { id, isAdmin, ...updateFields } = data;
    if(isAdmin) updateFields.role = "admin"
    else updateFields.role = "user"

    const projection: ProjectionFields<User> = { _id: 0, cardHolderName: 0, cardNumber: 0, password: 0, deleted: 0, __v: 0 }

    const updated = await UserSchema.findOneAndUpdate(
        { id: id, deleted: { $ne: true } },
        { $set: updateFields },
        { projection, new: true, lean: true },
    );

    if (!updated) {
        return null;
    };

    return updated;
}
