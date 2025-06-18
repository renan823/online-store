import { FilterQuery, ProjectionFields } from "mongoose";
import { User } from "../../domain/user";
import { UserSchema } from "../../models/user";

// Use case: search user by id
export async function findUserByIdUseCase(id: string): Promise<User | null> {
    const query: FilterQuery<User> = { id, deleted: false }
    const projection: ProjectionFields<User> = { _id: 0, password: 0, cardHolderName: 0, cardNumber: 0, deleted: 0, __v: 0 }

    const user = await UserSchema.findOne(query, projection).lean();
    if (!user) {
        return null;
    }

    return user;
}