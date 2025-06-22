import { Badge } from "@/components/ui/badge";
import { ErrorMessage, LoadingMessage, EmptyMessage } from "@/components/ui/messages";
import { useFetchUserOrders } from "@/services/order.service";
import { Order, statusStyles, statusTranslations } from "@/lib/types/order";
import { Boxes, Package } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrdersPageProps {
    userId: string;
    token: string;
}

export function OrdersPage({ userId, token }: OrdersPageProps) {
    const { data, isLoading, error } = useFetchUserOrders(userId, token);

    if (isLoading) {
        return <LoadingMessage message="Carregando histórico de compras..." />;
    }

    if (error) {
        return <ErrorMessage message={`Erro ao carregar pedidos: ${error.message}`} />;
    }

    if (!data || data.items.length === 0) {
        return <EmptyMessage message="Você ainda não fez nenhum pedido." />;
    }

    // Ordenar do mais novo para o mais antigo
    const sortedOrders = [...data.items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Suas compras</h2>
            <ScrollArea className="h-[50vh]">
                {sortedOrders.map(order => <OrderGroup key={order.id} order={order} />)}
            </ScrollArea>
        </div>
    );
}

function OrderGroup({ order }: { order: Order }) {
    const date = new Date(order.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="border border-muted rounded-lg shadow-sm p-4 space-y-4 my-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-lg font-semibold">
                    Pedido em {date}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold">R$ {order.total.toFixed(2)}</span>
                    <Badge className={statusStyles[order.status]}>{statusTranslations[order.status]}</Badge>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {order.items.map(item => (
                    <div key={item.product.id} className="border border-border rounded-md p-3 bg-muted/30">
                        <div className="flex items-start gap-2">
                            {item.quantity === 1 ? <Package className="text-primary w-5 h-5 mt-1" /> : <Boxes className="text-primary w-5 h-5 mt-1" />}
                            <div className="space-y-1">
                                <Link
                                    to="/products/$id"
                                    params={{ id: item.product.id }}
                                    className="text-sm font-semibold text-rose-600 hover:underline"
                                >
                                    {item.product.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} unidade(s) &middot; R$ {item.product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
