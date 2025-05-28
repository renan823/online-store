import { ProductCard } from '@/components/features/product/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ProductFilterSchema } from '@/lib/types/product'
import { useFetchProducts } from '@/services/product.service'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/products/')({
	validateSearch: ProductFilterSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const { isLoading, error, data } = useFetchProducts(search);

	const [nameSearch, setNameSearch] = useState<string>("");

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

	function handleSearch() {
		if (nameSearch.trim() !== "") {
			navigate({ search: (prev) => ({ ...prev, search: nameSearch })});
		} 
	}

	return (
		<div className='space-y-4 p-2'>
			<div className='flex justify-center'>
				<div className='w-[50vw] flex items-center gap-5'>
					<Input className='p-2 h-12' placeholder='Buscar items...' onChange={evt => setNameSearch(evt.target.value)} />
					<Button className='size-12' onClick={handleSearch}><Search className='size-6' /></Button>
				</div>
			</div>
			<div className='p-4 flex justify-center'>
				<ScrollArea>
					<div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-15'>
						{data?.map(p => <ProductCard product={p} key={p.id} />)}
					</div>
					<ScrollBar />
				</ScrollArea>
			</div>
		</div>
	)
}
