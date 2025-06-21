import { User } from "../../domain/user";
import { UserSchema } from "../../models/user";
import { FilterQuery } from "mongoose";

// Use case: check if the credentials match
export async function checkCredentials(email: string, password: string): Promise<string | null> {
    const query: FilterQuery<User> = {
        $and: [
            { email },
            { password },
            { deleted: false }
        ]
    }
    const users: User[] = await UserSchema.find(query).lean();
    if(users.length == 1) return users[0].id
    else return null;
}

// Use case: check if the user with given id is admin
export async function checkForAdmin(id: string): Promise<boolean> {
    const query: FilterQuery<User> = {
        $and: [
            { id },
            { role: "admin" },
            { deleted: false }
        ]
    }
    const users: User[] = await UserSchema.find(query).lean();
    if(users.length == 1) return true
    else return false;
}