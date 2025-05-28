import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { Link } from "@tanstack/react-router";

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
                        <h2 className="font-bold text-xl">R${product.price.toFixed(2)}</h2>
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}