import { CheckoutModal } from '@/components/features/cart/checkout'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/context/auth'
import { useCart } from '@/context/cart'
import { notify } from '@/lib/notify'
import { CartItem } from '@/lib/types/cart'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CreditCard, Minus, PackageSearch, Plus, ShoppingCart } from 'lucide-react'

export const Route = createFileRoute('/cart/')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate();

	const { items, getTotal, getTotalWithDiscounts } = useCart();

	const { user } = useAuth();

	function redirectLoging() {
		navigate({ to: "/user/login", search: { redirect: "/cart"}})
	}

	if (items.length === 0) {
		return (
			<div className="p-8 mt-[10vw] flex flex-col items-center justify-center text-center gap-6">
				<PackageSearch className="w-16 h-16 text-muted-foreground" />

				<div>
					<h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
					<p className="text-muted-foreground mt-2">
						Parece que você ainda não adicionou nada ao carrinho.
					</p>
				</div>

				<Button asChild className="px-6 py-2 text-base">
					<Link to="/products">Explorar produtos</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className='space-y-4 p-4 flex gap-4'>
			<div className='w-2/3'>
				<div className="overflow-x-auto">
					<Table className="min-w-[600px]">
						<TableHeader>
							<TableRow>
								<TableHead>Produto</TableHead>
								<TableHead className="text-center">Quantidade</TableHead>
								<TableHead className="text-center">Preço Unitário</TableHead>
								<TableHead className="text-center">Preço Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item, index) => (
								<CartItemRow item={item} key={index} />
							))}
						</TableBody>
					</Table>
				</div>
			</div>
			<div className='w-1/3 border-l-2 p-4 space-y-4'>
				<div className='flex gap-4 items-center'>
					<ShoppingCart />
					<h1 className='font-bold text-xl'>Meu carrinho</h1>
				</div>
				<div className='space-y-8'>
					<div className="text-center md:text-left">
						<p className='font-bold text-lg'>Subtotal: R$ {getTotal().toFixed(2)}</p>
						<p className='font-bold text-lg'>Total (com descontos): R$ {getTotalWithDiscounts().toFixed(2)}</p>
					</div>
					<div className='flex justify-between'>
						<Button onClick={() => navigate({ to: "/products" })} size="lg" variant="secondary">Continuar comprando</Button>
						{
							user !== null ?
								<CheckoutModal />
								:
								<Button onClick={redirectLoging} className="flex items-center gap-2">
									<CreditCard className="w-4 h-4" />
									Finalizar Compra
								</Button>
						}
					</div>
				</div>
			</div>
		</div>
	)
}

interface CartItemCardProps {
	item: CartItem;
}

function CartItemRow({ item }: CartItemCardProps) {
	const navigate = useNavigate();
	const { update } = useCart();

	function increaseAmount() {
		update(item.productId, item.quantity + 1);
	}

	function decreaseAmount() {
		update(item.productId, item.quantity - 1);

		if (item.quantity - 1 <= 0) {
			notify.success("Removido do carrinho");
		}
	}

	return (
		<TableRow>
			<TableCell
				onClick={() => navigate({ to: "/products/$id", params: { id: item.productId } })}
				className="flex items-center gap-4 cursor-pointer"
			>
				<img src={item.image} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md" />
				<span className="font-semibold text-sm sm:text-base">{item.name}</span>
			</TableCell>
			<TableCell className="text-center">
				<div className="flex items-center justify-center gap-2 sm:gap-4">
					<Button variant="outline" size="icon" onClick={decreaseAmount}>
						<Minus />
					</Button>
					<p>{item.quantity}</p>
					<Button variant="outline" size="icon" onClick={increaseAmount}>
						<Plus />
					</Button>
				</div>
			</TableCell>
			<TableCell className="text-center text-sm sm:text-base">
				R$ {item.price.toFixed(2)}
			</TableCell>
			<TableCell className="text-center text-sm sm:text-base">
				R$ {(item.price * item.quantity).toFixed(2)}
			</TableCell>
		</TableRow>
	)
}
