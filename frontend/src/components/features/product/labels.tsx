import { Ban, Flame, Stars } from "lucide-react";

type ProductPriceLabelVariant = "md" | "lg";

interface ProductPriceLabelProps {
    price: number;
    discount: number;
    variant: ProductPriceLabelVariant;
}

export function ProductPriceLabel({ price, discount, variant }: ProductPriceLabelProps) {
    const hasDiscount = discount > 0;
    const finalPrice = price - (price * discount / 100);

    const sizeClasses = {
        md: {
            original: "text-base",
            final: "text-xl font-bold",
            badge: "text-sm px-2 py-0.5",
        },
        lg: {
            original: "text-lg",
            final: "text-3xl font-extrabold",
            badge: "text-base px-3 py-1",
        },
    }[variant];

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {hasDiscount ? (
                <>
                    <span className={`line-through text-muted-foreground ${sizeClasses.original}`}>
                        R${price.toFixed(2)}
                    </span>

                    <span className={`bg-rose-500 text-white rounded ${sizeClasses.badge}`}>
                        -{discount}%
                    </span>

                    <span className={`text-black ${sizeClasses.final}`}>
                        R${finalPrice.toFixed(2)}
                    </span>
                </>
            ) : (
                <span className={`text-foreground ${sizeClasses.final}`}>
                    R${price.toFixed(2)}
                </span>
            )}
        </div>
    );
}

interface ProductLastUnitsLabelProps {
    quantity: number;
}

export function ProductLastUnitsLabel({ quantity }: ProductLastUnitsLabelProps) {
    if (quantity > 10) {
        return (
            <></>
        )
    }

    if (quantity === 0) {
        return (
            <div className="flex gap-1 items-center">
                <Ban className="text-rose-600/80"/>
                <h3 className="font-bold">Fora de estoque</h3>
            </div>
        )
    }

    if (quantity === 1) {
        return (
            <div className="flex gap-1 items-center">
                <Stars className="text-rose-600/80"/>
                <h3 className="font-bold">Última unidade</h3>
            </div>
        )
    }

    return (
        <div className="flex gap-1 items-center">
            <Flame className="text-rose-600/80"/>
            <h3 className="font-bold">Últimas {quantity} unidades</h3>
        </div>
    )
}