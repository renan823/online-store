import { DeleteProductModal } from '@/components/features/product/delete';
import { ProductPriceLabel } from '@/components/features/product/price';
import { UpdateProductModal } from '@/components/features/product/update';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/context/auth';
import { useCart } from '@/context/cart';
import { notify } from '@/lib/notify';
import { useFetchProductById } from '@/services/product.service';
import { createFileRoute } from '@tanstack/react-router'
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/products/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams();

	const { isLoading, error, data: product } = useFetchProductById(id);

	const { add } = useCart();
	const { user } = useAuth();

	const [quantity, setQuantity] = useState(1);

	function addToCart() {
		if (!product) {
			return;
		}

		add(
			{
				productId: product.id,
				name: product.name,
				discount: product.discount,
				image: product.images[0],
				price: product.price
			},
			quantity
		)
		notify.success("Adicionado ao carrinho");
	}

	function increaseAmount() {
		if (!product) {
			return;
		}

		if (product.quantityStock > quantity) {
			setQuantity(quantity + 1);
		}
	}

	function decreaseAmount() {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-between p-10'>
				<h1 className='text-2xl text-center'>Carregando...</h1>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-between p-10'>
				<h1 className='text-2xl text-center'>Erro: {error.message}</h1>
			</div>
		)
	}

	if (!product) {
		return (
			<div className='flex items-center justify-between p-10'>
				<h1 className='text-2xl text-center'>Erro: Produto inválido</h1>
			</div>
		)
	}

	return (
		<div className="flex justify-center my-20">
			<div className="w-[60vw]">
				<div className="flex gap-15">
					<Carousel opts={{ align: "start", loop: true }}>
						<CarouselContent>
							{
								product.images.map((im, idx) => {
									return (
										<CarouselItem key={idx} className='w-full'>
											<Card>
												<CardContent>
													<img src={im} className='w-full' />
												</CardContent>
											</Card>
										</CarouselItem>
									)
								})
							}
						</CarouselContent>
						<CarouselNext />
						<CarouselPrevious />

					</Carousel>
					<div className="w-full flex flex-col space-y-4">
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<div>
							<h2>Descrição</h2>
							<p>{product.description}</p>
						</div>
						<div className='flex gap-2'>
							<h2>Marca: {product.brand}</h2>
							{
								user && user.role === "admin" ?
									<div className='flex gap-2'>
										<h2>Estoque: {product.quantityStock}</h2>
										<h2>Vendidos: {product.quantitySold}</h2>
									</div>
									:
									<></>
							}
						</div>
						<div>
							<ProductPriceLabel discount={product.discount} price={product.price} variant="lg" />
						</div>
						{
							user && user.role === "admin" ?
								<div className="flex justify-end gap-6 items-center mt-auto mb-5">
									<DeleteProductModal id={product.id} name={product.name}/>
									<UpdateProductModal product={product}/>
								</div>
								:
								<div className="flex justify-end gap-6 items-center mt-auto mb-5">
									<div className="flex items-center justify-center gap-2 sm:gap-4">
										<Button variant="outline" size="icon" onClick={decreaseAmount}>
											<Minus />
										</Button>
										<p>{quantity}</p>
										<Button variant="outline" size="icon" onClick={increaseAmount}>
											<Plus />
										</Button>
									</div>
									<Button onClick={addToCart} className="font-bold text-lg px-8 py-2">Adicionar ao carrinho</Button>
								</div>
						}
					</div>
				</div>
			</div>
		</div>
	)
}


