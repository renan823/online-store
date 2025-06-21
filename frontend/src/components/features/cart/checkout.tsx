import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/cart'
import { useAuth } from '@/context/auth'
import { useCreateOrder } from '@/services/order.service'
import { z } from 'zod'
import { PaymentCardSchema } from '@/lib/types/user'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ControlledFieldError, { ControlledTextInput } from '@/components/ui/controlled-form'
import { notify } from '@/lib/notify'

type PaymentCardFormData = z.infer<typeof PaymentCardSchema>

export function CheckoutModal() {
    const [open, setOpen] = useState(false);

    const { clear, cart } = useCart();
    const { user, token } = useAuth();
    
    const createOrder = useCreateOrder();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<PaymentCardFormData>({
        resolver: zodResolver(PaymentCardSchema)
    })

    async function onSubmit(data: PaymentCardFormData) {
        if (!user || !token || !cart) {
            notify.error("Você precisa estar logado para finalizar sua compra.");
            setOpen(false);
            return;
        }

        const order = {
            userId: user.id,
            items: cart.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
            card: data,
        };

        createOrder.mutate({ orderData: order, token }, { 
            onSuccess: () => {
                reset();
                clear();
                setOpen(false);
            }
        })
    }

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

                <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <Label htmlFor="name">Nome no Cartão</Label>
                        <ControlledTextInput control={control} name='name' placeholder=''/>
                        <ControlledFieldError error={errors.name}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="card">Número do Cartão</Label>
                        <ControlledTextInput control={control} name='number' placeholder=''/>
                        <ControlledFieldError error={errors.number}/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="expiration">Validade</Label>
                            <ControlledTextInput control={control} name='expiration' placeholder=''/>
                            <ControlledFieldError error={errors.expiration}/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <ControlledTextInput control={control} name='cvv' placeholder=''/>
                            <ControlledFieldError error={errors.cvv}/>
                        </div>
                    </div>
                     <Button type="submit">
                        {createOrder.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Finalizando...
                            </>
                        ) : (
                            "Finalizar Compra"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}