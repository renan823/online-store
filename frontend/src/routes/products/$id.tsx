import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { notify } from '@/lib/notify';
import { useFetchProductById } from '@/services/product.service';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams();

	const { isLoading, error, data: product } = useFetchProductById(id);

	function addToCart() {
		notify.success("Adicionado ao carrinho");
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
			<div className="w-[70vw]">
				<div className="flex gap-15">
					<Carousel opts={{ align: "start", loop: true }}>
						<CarouselContent>
							{
								product.images.map((im, idx) => {
									return (
										<CarouselItem key={idx}>
											<img src={im} className='w-[400px]'/>
										</CarouselItem>
									)
								})
							}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					<div className="w-full flex flex-col space-y-4">
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<div>
							<h2>Descrição</h2>
							<p>{product.description}</p>
						</div>
						<div>
							<h2>Marca: {product.brand}</h2>
						</div>
						<div className="flex justify-between items-center mt-auto mb-5">
							<h2 className='text-2xl font-bold'>R${product.price.toFixed(2)}</h2>
							<Button onClick={addToCart} className="font-bold text-lg px-8 py-2">Comprar</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


