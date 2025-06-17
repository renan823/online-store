import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/cart'
import { useAuth } from '@/context/auth'
import { useCreateOrder } from '@/services/order.service'

export function CheckoutModal() {
    const [cardNumber, setCardNumber] = useState('');
    const [name, setName] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiration, setExpiration] = useState('');
    const [open, setOpen] = useState(false);

    const { items, clear } = useCart();
    const { user } = useAuth();
    const createOrder = useCreateOrder();

    const handleSubmit = async () => {
        if (!user) return;

        const orderData = {
            userId: user.id,
            cardId: 'dummy-card-id', // O backend espera um cardId
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        await createOrder.mutateAsync(orderData, {
            onSuccess: () => {
                clear(); // Limpa o carrinho
                setOpen(false); // Fecha o modal
            }
        });
    }

    const isFormInvalid = !cardNumber || !name || !cvv || !expiration || items.length === 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Finalizar Compra
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pagamento</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Nome no Cartão</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="João da Silva"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="card">Número do Cartão</Label>
                        <Input
                            id="card"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="expiration">Validade</Label>
                            <Input
                                id="expiration"
                                value={expiration}
                                onChange={(e) => setExpiration(e.target.value)}
                                placeholder="MM/AA"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="123"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isFormInvalid || createOrder.isPending}>
                        {createOrder.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Finalizando...
                            </>
                        ) : (
                            "Finalizar Compra"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}