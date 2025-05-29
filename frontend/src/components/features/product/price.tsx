type ProductPriceLabelVariant = "md" | "lg";

interface ProductPriceLabelProps {
    price: number;
    discount: number;
    variant: ProductPriceLabelVariant;
}

export function ProductPriceLabel({ price, discount, variant }: ProductPriceLabelProps) {
    const hasDiscount = discount > 0;
    const finalPrice = price - discount;
    const discountPercent = Math.round((discount / price) * 100);

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

                    <span className={`bg-red-500 text-white rounded ${sizeClasses.badge}`}>
                        -{discountPercent}%
                    </span>

                    <span className={`text-red-600 ${sizeClasses.final}`}>
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