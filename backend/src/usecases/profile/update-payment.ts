import { ProjectionFields } from "mongoose";
import { UserSchema } from "../../models/user";
import { PaymentInfo, UpdatePaymentInfoDTO } from "../../domain/profile";

// Use case: update user's data
export async function updatePaymentUseCase(data: UpdatePaymentInfoDTO): Promise<PaymentInfo | null> {
    const { userId, ...updateFields } = data;
    const projection: ProjectionFields<PaymentInfo> = { _id: 0, cardHolderName: 1, cardNumber: 1 }

    const updated = await UserSchema.findOneAndUpdate(
        { id: userId, deleted: { $ne: true } },
        { $set: updateFields },
        { projection, new: true, lean: true },
    );

    if (!updated) {
        return null;
    };

    return updated;
}
