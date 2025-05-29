import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DeleteProductModalProps {
    name: string
    id: string
}

export function DeleteProductModal({ name, id }: DeleteProductModalProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log(`Produto ${name} (ID: ${id}) deletado.`);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Excluir</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deletar Produto</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">
                    Tem certeza que deseja deletar o produto <span className="font-semibold text-foreground">"{name}"</span>?
                    Essa ação não poderá ser desfeita.
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
