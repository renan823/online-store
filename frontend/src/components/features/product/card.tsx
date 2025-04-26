import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { useNavigate } from "@tanstack/react-router";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();

    return (
        <Card className="w-[20vw] rounded-md">
            <CardHeader className="flex justify-center">
                <img src={product.image} />
            </CardHeader>
            <CardContent>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <CardDescription className="my-2">
                    <h2 className="font-bold text-xl">R${product.price}</h2>
                </CardDescription>
                <div className="flex justify-end">
                    <Button onClick={() => navigate({ to: "/products/$id", params: { id: product.id }})}>Comprar</Button>
                </div>
            </CardContent>
        </Card>
    )
}