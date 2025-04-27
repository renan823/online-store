import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CartItem } from '@/lib/types/cart'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

export const Route = createFileRoute('/cart/')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate();

	const item: CartItem = {
		product: {
			id: "12345",
			name: "Produto exemplo",
			description: "Um produto de muita qualidade, sem defeitos. Funciona em velocidade muito boa, é rápido.",
			brand: "Pineapple",
			price: 2500.50,
			discount: 0.2,
			image: "https://placehold.co/100",
			stock: 3
		},
		quantity: 1
	}

	const items = [item, item, item];

	// Total
	const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
	const total = items.reduce((acc, item) => acc + (item.product.price -  item.product.discount * item.product.price) * item.quantity, 0).toFixed(2);

	return (
		<div className='space-y-4 p-4'>
			<div className='flex gap-4 items-center'>
				<ShoppingCart/>
				<h1 className='font-bold text-xl'>Meu carrinho</h1>
			</div>
			<Separator />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Produto</TableHead>
						<TableHead className="text-center">Quantidade</TableHead>
						<TableHead className="text-center">Preço Unitário</TableHead>
						<TableHead className="text-center">Preço Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map(item => (
						<CartItemRow item={item} key={item.product.id} />
					))}
				</TableBody>
			</Table>
			<Separator/>
			<div className='flex justify-between items-center'>
				<Button onClick={() => navigate({ to: "/products"})} size="lg" variant="secondary">Continuar comprando</Button>
				<Card className='rounded-sm'>
					<CardContent className='flex flex-row items-center gap-20'>
						<p className='font-bold text-lg'>Subtotal: R$ {subtotal}</p>
						<p className='font-bold text-lg'>Total (com descontos): R$ {total}</p>
						<Button className='font-bold text-lg'>Finalizar compra</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

interface CartItemCardProps {
	item: CartItem;
}

function CartItemRow({ item }: CartItemCardProps) {
	const navigate = useNavigate();

	return (
		<TableRow>
			<TableCell 
				onClick={() => navigate({ to: "/products/$id", params: { id: item.product.id } })} 
				className="flex items-center gap-4 cursor-pointer"
			>
				<img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
				<span className="font-semibold">{item.product.name}</span>
			</TableCell>
			<TableCell className="text-center">
				<div className="flex items-center justify-center gap-4">
					<Button variant="outline" size="icon">
						<Minus />
					</Button>
					<p>{item.quantity}</p>
					<Button variant="outline" size="icon">
						<Plus />
					</Button>
				</div>
			</TableCell>
			<TableCell className="text-center">
				R$ {item.product.price.toFixed(2)}
			</TableCell>
			<TableCell className="text-center">
				R$ {(item.product.price * item.quantity).toFixed(2)}
			</TableCell>
		</TableRow>
	)
}
