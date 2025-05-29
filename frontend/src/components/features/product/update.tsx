import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ControlledFieldError, {
    ControlledFileInput,
    ControlledNumberInput,
    ControlledTextInput
} from "@/components/ui/controlled-form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Product } from "@/lib/types/product";

const UpdateProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    price: z.coerce.number().positive("Deve ser maior que 0"),
    brand: z.string().min(1, "Marca é obrigatória"),
    discount: z.coerce.number().min(0, "Mínimo é 0%").max(100, "Máximo é 100%"),
    file: z
        .instanceof(File, { message: "Escolha um arquivo de imagem" })
        .optional(),
});

type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;

interface UpdateProductModalProps {
    product: Product;
}

export function UpdateProductModal({ product }: UpdateProductModalProps) {
    const [open, setOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateProductFormData>({
        resolver: zodResolver(UpdateProductSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            brand: product.brand,
            discount: product.discount,
            file: undefined,
        },
    });

    const onSubmit = (data: UpdateProductFormData) => {
        const productMock = {
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            price: data.price,
            brand: data.brand,
            discount: data.discount,
            images: ["https://via.placeholder.com/150"], // Mock image
        };

        console.log("Created product (mock):", productMock);
        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Editar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar dados do produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label>Nome</Label>
                        <ControlledTextInput name="name" control={control} placeholder="" value="" />
                        <ControlledFieldError error={errors.name} />
                    </div>
                    <div>
                        <Label>Descrição</Label>
                        <ControlledTextInput name="description" control={control} placeholder="" value="" />
                        <ControlledFieldError error={errors.description} />
                    </div>
                    <div>
                        <Label>Preço</Label>
                        <ControlledNumberInput name="price" control={control} />
                        <ControlledFieldError error={errors.price} />
                    </div>
                    <div>
                        <Label>Marca</Label>
                        <ControlledTextInput name="brand" control={control} placeholder="" value="" />
                        <ControlledFieldError error={errors.brand} />
                    </div>
                    <div>
                        <Label>Desconto (%)</Label>
                        <ControlledNumberInput name="discount" control={control} />
                        <ControlledFieldError error={errors.discount} />
                    </div>
                    <div>
                        <Label>Fotos</Label>
                        <ControlledFileInput name="file" control={control} />
                        <ControlledFieldError error={errors.file} />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Atualizar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
