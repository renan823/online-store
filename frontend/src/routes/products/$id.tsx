import { DeleteProductModal } from '@/components/features/product/delete';
import { ProductLastUnitsLabel, ProductPriceLabel } from '@/components/features/product/labels';
import { UpdateProductModal } from '@/components/features/product/update';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/context/auth';
import { useCart } from '@/context/cart';
import { Product } from '@/lib/types/product';
import { useFetchProductById } from '@/services/product.service';
import { createFileRoute } from '@tanstack/react-router';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/products/$id')({
	component: RouteComponent,
});

interface OptionsProps {
	product: Product;
}

function UserOptions({ product }: OptionsProps) {
	const [quantity, setQuantity] = useState(1);
	const { add, cart } = useCart();

	function addToCart() {
		if (!product) return;

		const existingItem = cart?.items.find( i => i.product.id === product.id)
		//Checks if new product quantity will exceed quantity in stock
		const newQuantity = existingItem?.quantity + quantity > product.quantityStock ? product.quantityStock - existingItem?.quantity : quantity
		add(
			{
				id: product.id,
				name: product.name,
				discount: product.discount,
				image: product.images[0],
				price: product.price,
			},
			newQuantity
		);
	}

	function increaseAmount() {
		if (product && product.quantityStock > quantity) {
			setQuantity(quantity + 1);
		}
	}

	function decreaseAmount() {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	}

	return (
		<div className="flex flex-col gap-4 mt-6">
			<div className="flex items-center gap-3">
				<h2 className="text-sm font-medium text-muted-foreground">Quantidade</h2>
				<Button
					variant="outline"
					size="icon"
					onClick={decreaseAmount}
					className="rounded-2xl"
				>
					<Minus className="w-4 h-4" />
				</Button>
				<p className="text-lg font-bold">{quantity}</p>
				<Button
					variant="outline"
					size="icon"
					onClick={increaseAmount}
					className="rounded-2xl"
				>
					<Plus className="w-4 h-4" />
				</Button>
			</div>
			<Button
				disabled={product.quantityStock === 0}
				onClick={addToCart}
				className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-md px-6 py-2 flex items-center gap-2"
			>
				<ShoppingCart className="w-4 h-4" />
				Adicionar ao carrinho
			</Button>
		</div>
	);
}

function AdminOptions({ product }: OptionsProps) {
	return (
		<div className="flex justify-end gap-4 items-center mt-6">
			<DeleteProductModal
				id={product.id}
				name={product.name}
				images={product.images}
			/>
			<UpdateProductModal product={product} />
		</div>
	);
}

function RouteComponent() {
	const { id } = Route.useParams();
	const { isLoading, error, data: product } = useFetchProductById(id);
	const { user } = useAuth();

	if (isLoading || error || !product) {
		return (
			<div className="flex items-center justify-center p-10">
				<h1 className="text-2xl text-center">
					{isLoading
						? 'Carregando...'
						: error
							? `Erro: ${error.message}`
							: 'Erro: Produto inválido'}
				</h1>
			</div>
		);
	}

	return (
		<div className="flex justify-center my-30">
			<div className="w-[80vw] rounded-xl">
				<div className="flex gap-12 w-full">
					{/* Carrossel ocupa 2/3 da tela */}
					<Carousel className="w-2/3 p-2" opts={{ align: 'start', loop: true }}>
						<CarouselContent>
							{product.images.map((im, idx) => (
								<CarouselItem key={idx} className="w-full">
									<Card className="overflow-hidden">
										<CardContent className="flex items-center justify-center h-[400px] p-0">
											<img
												src={im}
												alt={`Imagem ${idx + 1}`}
												className="object-contain h-full w-full"
											/>
										</CardContent>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						{
							product.images.length > 1 ?
								<div>
									<CarouselPrevious />
									<CarouselNext />
								</div>
								:
								<div></div>
						}
					</Carousel>

					{/* Info do Produto */}
					<div className="w-1/3 flex flex-col justify-start gap-8">
						{/* Nome e descrição */}
						<div>
							<h1 className="text-3xl font-bold">{product.name}</h1>
							<p className="text-sm text-muted-foreground">{product.description}</p>
						</div>

						{/* Badges */}
						<div className="flex gap-2 flex-wrap">
							<Badge>Marca: {product.brand}</Badge>
							<Badge>Estoque: {product.quantityStock}</Badge>
							<Badge>Vendidos: {product.quantitySold}</Badge>
						</div>

						{/* Preço */}
						<div className="bg-rose-50 p-4 rounded-xl space-y-4">
							{/* Últimas unidades (para usuário) */}
							{(!user || user.role === 'user') && (
								<ProductLastUnitsLabel quantity={product.quantityStock} />
							)}
							<ProductPriceLabel
								discount={product.discount}
								price={product.price}
								variant="lg"
							/>
						</div>

						{/* Ações */}
						<div>
							{user?.role === "admin" && <AdminOptions product={product} />}
							{(!user || user.role === "user") && <UserOptions product={product} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

