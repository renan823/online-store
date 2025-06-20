// Estrutura de um item no carrinho, como recebido da API
export interface CartItem {
    product: {
        id: string;
        name: string;
        price: number;
        discount: number;
        image: string;
    };
    quantity: number;
}

// Estrutura completa do carrinho
export interface Cart {
    id: string;
    user: string;
    items: CartItem[];
}

// DTO para atualizar um item no carrinho
export interface UpdateCartItemDTO {
    userId: string;
    productId: string;
    quantity: number;
}