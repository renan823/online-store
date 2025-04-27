import { ProductCard } from '@/components/features/product/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Product } from '@/lib/types/product'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/products/')({
	component: RouteComponent,
})

function RouteComponent() {

	const product: Product = {
		id: "12345",
		name: "Produto exemplo",
		description: "Um produto de muita qualidade, sem defeitos. Funciona em velocidade muito boa, é rápdio.",
		brand: "Pineapple",
		price: 2500.50,
		discount: 0.2,
		image: "https://placehold.co/300",
		stock: 3
	}

	return (
		<div className='space-y-4 p-2'>
			<div className='flex justify-center'>
				<div className='w-[50vw] flex items-center gap-5'>
					<Input placeholder='Buscar items...'/>
					<Button size="icon"><Search/></Button>
				</div>
			</div>
			<Separator/>
			<div className='p-4 flex justify-center'>
				<ScrollArea>
					<div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-15'>
						<ProductCard product={product}/>
						<ProductCard product={product}/>
						<ProductCard product={product}/>
						<ProductCard product={product}/>
						<ProductCard product={product}/>
						<ProductCard product={product}/>
					</div>
					<ScrollBar/>
				</ScrollArea>
			</div>
		</div>
	)
}
