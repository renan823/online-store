import { toast } from "sonner";

export const notify = {
    success: (message: string | undefined) => toast.success(message || "Done"),
    error: (message: string | undefined) => toast.warning(message || "Something went wrong"),
    info: (message: string | undefined) => toast.info(message || "Ok")
}

