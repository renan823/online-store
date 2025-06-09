import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { Link } from "@tanstack/react-router";
import { ProductPriceLabel } from "@/components/features/product/labels";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Link to="/products/$id" params={{ id: product.id }}>
			<Card className="transition-all duration-300 border-2 border-transparent hover:border-rose-500 hover:shadow-lg hover:scale-[1.02] xl:w-[20vw] lg:w-[18vw] md:w-[25vw] sm:w-[60vw] rounded-xl h-full">
				<CardHeader className="flex items-center justify-center p-4">
					<div className="w-full h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center">
						<img
							src={product.images[0]}
							alt={product.name}
							className="object-contain h-full"
						/>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 px-4 pb-4">
					<CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
					<CardDescription className="text-sm text-muted-foreground line-clamp-2">
						{product.description}
					</CardDescription>
					<div className="mt-2">
						<ProductPriceLabel
							discount={product.discount}
							price={product.price}
							variant="md"
						/>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
