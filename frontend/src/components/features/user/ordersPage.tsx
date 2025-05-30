// frontend/src/components/features/user/orders-page.tsx
import { Badge } from "@/components/features/user/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockOrders = [
    {
        id: "1",
        value: 4900.00,
        productDetails: "Notebook Gamer Acer Nitro V15 ANV15-51-7837 Intel Core i7, 16GB RAM, DDR5, Nvidia RTX 3050, 512GB SSD, 15.6” Linux, Preto - NH.QDDAL.008",
        status: "Entregue",
    },
    {
        id: "2",
        value: 3299.00,
        productDetails: "Notebook Acer Aspire 5 AMD Ryzen7-5700U, 16GB RAM, SSD 512GB, 15.6” FHD IPS, AMD Radeon, Linux, Prata - A515-45-R74N",
        status: "Cancelado",
    },
    {
        id: "3",
        value: 199.99,
        productDetails: "Headset Gamer Sem Fio Havit Fuxi H3, 7.1 surround, Driver 40mm, Bluetooth e USB, Preto - Fuxi--H3 Black",
        status: "Transporte",
    },
];

type OrderStatus = "Entregue" | "Cancelado" | "Transporte" | "Pendente";

function getStatusBadgeVariant(status: OrderStatus): "default" | "destructive" | "secondary" | "outline" {
    switch (status) {
        case "Entregue":
            return "default"; // Will be styled green
        case "Cancelado":
            return "destructive"; // Will be styled red
        case "Transporte":
            return "secondary"; // Will be styled yellow/orange
        case "Pendente":
            return "outline"; // Will be styled with a border
        default:
            return "outline";
    }
}

function getStatusBadgeColors(status: OrderStatus): string {
    switch (status) {
        case "Entregue":
            return "bg-green-500 hover:bg-green-600 text-white";
        case "Cancelado":
            return "bg-red-600 hover:bg-red-700 text-white"; // destructive variant handles this
        case "Transporte":
            return "bg-yellow-500 hover:bg-yellow-600 text-black";
        case "Pendente":
            return "border-gray-500 text-gray-700"; // outline variant handles this
        default:
            return "";
    }
}


export function OrdersPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Histórico de Pedidos</h2>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">Pedido</TableHead>
                            <TableHead className="w-[150px] text-center">Valor</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead className="w-[150px] text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium text-center">{order.id}</TableCell>
                                <TableCell className="text-center">R$ {order.value.toFixed(2)}</TableCell>
                                <TableCell className="max-w-xs truncate">{order.productDetails}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant={getStatusBadgeVariant(order.status as OrderStatus)}
                                        className={cn("text-xs px-2 py-0.5", getStatusBadgeColors(order.status as OrderStatus))}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {mockOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                    Você ainda não fez nenhum pedido.
                </p>
            )}
        </div>
    );
}

// Helper function to combine class names, needed if not already present
// If you have a `cn` utility (like in shadcn/ui), you can use that.
// Otherwise, a simple version:
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}