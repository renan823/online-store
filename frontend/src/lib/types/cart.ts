import { Product } from "@/lib/types/product";

export interface CartItem {
    product: Product;
    quantity: number;
}