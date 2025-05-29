import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { Link } from "@tanstack/react-router";
import { ProductPriceLabel } from "@/components/features/product/price";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to="/products/$id" params={{ id: product.id }}>
            <Card className="xl:w-[20vw] lg:w-[18vw] md:w-[25vw] sm:w-[60vw] rounded-md h-full hover:">
                <CardHeader className="flex justify-center">
                    <img src={product.images[0]} />
                </CardHeader>
                <CardContent>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                    <CardDescription className="my-2">
                        <ProductPriceLabel discount={product.discount} price={product.price} variant="md"/>
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}