import { ProductCard } from '@/components/features/product/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductFilterSchema } from '@/lib/types/product'
import { useFetchProducts } from '@/services/product.service'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, ArrowLeft, ArrowRight, Filter, Hash } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { LoadingMessage, EmptyMessage, ErrorMessage } from '@/components/ui/messages'
import { useAuth } from '@/context/auth'
import { NewProductModal } from '@/components/features/product/new'

export const Route = createFileRoute('/products/')({
	validateSearch: ProductFilterSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const { user } = useAuth();

	const { isLoading, error, data } = useFetchProducts(search);

	const [nameSearch, setNameSearch] = useState<string>(search.search || '');

	const currentPage = data?.meta.page || 0;
	const totalPages = data?.meta.pages || 1;
	const totalItems = data?.meta.total || 0;

	function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		navigate({
			search: (prev) => ({
				...prev,
				search: nameSearch.trim() !== '' ? nameSearch.trim() : undefined,
				page: 0,
			}),
		})
	}

	function goToPage(page: number) {
		navigate({
			search: (prev) => ({
				...prev,
				page: page,
			}),
		})
	}

	if (isLoading) {
		return (<LoadingMessage message='Carregando...' />);
	}

	if (error) {
		return (<ErrorMessage message="Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde." />);
	}

	return (
		<div className="space-y-6 p-4">
			<div className="flex justify-center">
				<form className="w-[90vw] max-w-2xl flex items-center gap-3" onSubmit={handleSearch}>
					<Input
						className="h-12"
						placeholder="Buscar produtos..."
						onChange={(e) => setNameSearch(e.target.value)}
					/>
					<Button className="h-12 w-12 p-0" type="submit">
						<Search className="w-6 h-6" />
					</Button>
				</form>
			</div>

			<div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-2 bg-muted ">
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<Hash className="w-4 h-4" />
					<span>
						<strong>{totalItems}</strong> produtos encontrados - exibindo <strong>{data?.items.length}</strong>
					</span>
					{search.search && (
						<>
							<Filter className="w-4 h-4" />
							<span>
								Filtro: "<strong>{search.search}</strong>"
							</span>
						</>
					)}
				</div>

				<div className='flex items-center gap-6'>
					<div className="flex items-center gap-2 text-sm">
						<Button
							variant="outline"
							size="icon"
							disabled={currentPage <= 0}
							onClick={() => goToPage(currentPage - 1)}
						>
							<ArrowLeft className="w-4 h-4" />
						</Button>
						<span className="px-2">
							Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
						</span>
						<Button
							variant="outline"
							size="icon"
							disabled={currentPage >= totalPages - 1}
							onClick={() => goToPage(currentPage + 1)}
						>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>

					{
						user && user.role === "admin" ?
							<div>
								<NewProductModal />
							</div>
							:
							<></>
					}
				</div>
			</div>

			<div className="px-2 w-full">
				{data && data.items.length === 0 ? (
					<EmptyMessage message='Nenhum produto encontrado.' />
				) : (
					<div className="grid grid-cols-4 gap-6">
						{data?.items.map((product) => (
							<div className='flex justify-center' key={product.id} >
								<ProductCard product={product} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
