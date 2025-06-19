import { User } from "../../domain/user";
import { UserSchema } from "../../models/user";
import { FilterQuery, ProjectionFields } from "mongoose";

// Use case: search users by name/email
export async function findManyUsersUseCase(searchTerm: string): Promise<User[]> {
    const query: FilterQuery<User> = {
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },   // Case-insensitive match on name
            { email: { $regex: searchTerm, $options: "i" } }  // Case-insensitive match on email
        ],
        $and: [
            { deleted: false }
        ]
    }
    const projection: ProjectionFields<User> = { _id: 0, password: 0, cardHolderName: 0, cardNumber: 0, deleted: 0, __v: 0 }
    const users: User[] = await UserSchema.find(query, projection).lean();
    return users;
}