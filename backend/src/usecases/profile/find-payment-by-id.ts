import { FilterQuery, ProjectionFields } from "mongoose";
import { UserSchema } from "../../models/user";
import { User } from "../../domain/user";
import { PaymentInfo } from "../../domain/profile";

// Use case: search user by id
export async function findPaymentByUserIdUseCase(id: string): Promise<PaymentInfo | null> {
    const query: FilterQuery<User> = { id, deleted: false }
    const projection: ProjectionFields<PaymentInfo> = { _id: 0, cardHolderName: 1,  cardNumber: 1}

    const paymentInfo = await UserSchema.findOne(query, projection).lean();
    if (!paymentInfo) {
        return null;
    }

    return paymentInfo;
}