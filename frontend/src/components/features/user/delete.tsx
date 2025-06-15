import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteUser } from "@/services/user.service";
import { Trash2 } from "lucide-react";

type UserId  = {
    id: string
}

export function DeleteUserModal({ id }: UserId) {
    // State to control whether the dialog is open or not
    const [open, setOpen] = useState(false);

    const deleteUser = useDeleteUser();

    // Handler for when the user confirms deletion
    async function onDelete(){
        deleteUser.mutate(id, {onSuccess: () => {
            // Close the dialog on successful deletion
            setOpen(false)
        }})
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1 md:mr-0"/> <span className="hidden md:inline">Excluir</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
                <DialogHeader>
                    <DialogTitle>Exclusão de Usuário</DialogTitle>
                </DialogHeader>
                    <span>Realmente deseja excluir o usuário {id}?</span>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} className="text-primary bg-white border-2 border-solid border-primary hover:text-white">
                            Cancelar
                        </Button>
                        <Button onClick={onDelete}>Excluir</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
