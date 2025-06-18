import { ProjectionFields } from "mongoose";
import { User } from "../../domain/user";
import { UserSchema } from "../../models/user";
import { UpdatePersonalDTO } from "../../domain/profile";

// Use case: update personal information
export async function updatePersonalUseCase(data: UpdatePersonalDTO): Promise<User | null> {
    const { id, ...updateFields } = data;
    const projection: ProjectionFields<User> = { _id: 0, password: 0, cardHolderName: 0, cardNumber: 0, role: 0, deleted: 0, __v: 0 }

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
