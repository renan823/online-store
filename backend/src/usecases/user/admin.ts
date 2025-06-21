import { UserSchema } from "../../models/user";

export async function createDefaultAdminUseCase() {
    const user = await UserSchema.findOne({ email: "admin@email.com" });
    if (!user) {
        await UserSchema.create({ 
            role: "admin", 
            email: "admin@email.com", 
            name: "Admin", 
            password: "admin_admin", 
            id: crypto.randomUUID(),
            phone: "",
            address: ""
        })
    }
}