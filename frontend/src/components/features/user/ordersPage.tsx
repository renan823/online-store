import { Badge } from "@/components/features/user/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ErrorMessage, LoadingMessage, EmptyMessage } from "@/components/ui/messages";
import { useFetchUserOrders } from "@/services/order.service";
import { Order } from "@/lib/types/order";

// Mapeamento de status para estilos de badge
const statusStyles: Record<Order['status'], string> = {
    pending: "bg-yellow-500 hover:bg-yellow-600 text-black",
    paid: "bg-blue-500 hover:bg-blue-600 text-white",
    shipped: "bg-green-500 hover:bg-green-600 text-white",
    cancelled: "bg-red-600 hover:bg-red-700 text-white",
};

const statusTranslations: Record<Order['status'], string> = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    cancelled: "Cancelado",
};

interface OrdersPageProps {
    userId: string;
}

export function OrdersPage({ userId }: OrdersPageProps) {
    const { data: pagination, isLoading, error } = useFetchUserOrders(userId);
    const orders = pagination?.items;

    if (isLoading) {
        return <LoadingMessage message="Carregando histórico de compras..." />;
    }

    if (error) {
        return <ErrorMessage message={`Erro ao carregar pedidos: ${error.message}`} />;
    }

    if (!orders || orders.length === 0) {
        return <EmptyMessage message="Você ainda não fez nenhum pedido." />;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Histórico de Pedidos</h2>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Data</TableHead>
                            <TableHead>Itens</TableHead>
                            <TableHead className="text-center w-[120px]">Total</TableHead>
                            <TableHead className="text-center w-[120px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {order.items.map(item => `${item.quantity}x ${item.productId}`).join(', ')}
                                </TableCell>
                                <TableCell className="font-medium text-center">
                                    R$ {order.total.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className={statusStyles[order.status]}>
                                        {statusTranslations[order.status]}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}