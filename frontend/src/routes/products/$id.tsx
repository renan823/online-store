import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { Product } from '@/lib/types/product';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams();

	const product: Product = {
		id,
		name: "Produto exemplo",
		description: "Um produto de muita qualidade, sem defeitos. Funciona em velocidade muito boa, é rápido.",
		brand: "Pineapple",
		price: 2500.50,
		discount: 0.2,
		image: "https://placehold.co/300",
		stock: 3
	}

	function addToCart() {
		notify.success("Adicionado ao carrinho");
	}

	return (
		<div className="flex justify-center my-20">
			<div className="w-[70vw]">
				<div className="flex gap-15">
					<div>
						<img src="https://placehold.co/500" />
					</div>
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
							<h2 className='text-2xl font-bold'>R${product.price}</h2>
							<Button onClick={addToCart} className="font-bold text-lg px-8 py-2">Comprar</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


