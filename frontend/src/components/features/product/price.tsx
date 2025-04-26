import { cn } from "@/lib/utils";

interface ProductPriceProps {
    price: number;
    discount: number;
    size?: string;
}

export function ProductPrice({ price, discount, size }: ProductPriceProps) {
    if (discount !== 0) {
        console.log("aplicar desconto");
    }

    console.log(cn("font-bold", `text-${size ?? "lg"}`))

    return (
        <h2 className={cn("font-bold", `text-${size ?? "lg"}`)}>R${price}</h2>
    )
}