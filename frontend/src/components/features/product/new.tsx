import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ControlledFieldError, {
    ControlledMultipleFileInput,
    ControlledNumberInput,
    ControlledTextInput
} from "@/components/ui/controlled-form";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CreateProductDTO, CreateProductSchema } from "@/lib/types/product";
import { useUploadFiles } from "@/services/cdn.service";
import { useCreateProduct } from "@/services/product.service";
import { z } from "zod";
import { CDN_URL } from "@/services/config";

type CreateProductFormData = z.infer<typeof CreateProductSchema>;

export function NewProductModal() {
    const [open, setOpen] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateProductFormData>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: "",
            description: "",
            quantityStock: 0,
            price: 0,
            brand: "",
            discount: 0,
        },
    });

    const uploadImages = useUploadFiles();
    const createProduct = useCreateProduct();

    /*
    Cria um novo produto.
    Envia as imagens pra CDN.
    Depois envia o produto para o backend.
    */
    async function onSubmit(data: CreateProductFormData) {
        const payload: CreateProductDTO = {
            name: data.name,
            description: data.description,
            brand: data.brand,
            discount: data.discount,
            images: [],
            price: data.price,
            quantityStock: data.quantityStock
        }

        if (data.files.length !== 0) {
            await uploadImages.mutateAsync(data.files, { 
                onSuccess: (r) => payload.images = r.map(url => `${CDN_URL}/${url}`) 
            });
        }

        createProduct.mutate(payload);

        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Novo Produto</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
                <DialogHeader>
                    <DialogTitle>Cadastrar produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-10">
                        <div className="w-[15vw] space-y-4">
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
                                <Label>Quantidade</Label>
                                <ControlledNumberInput name="quantityStock" control={control} />
                                <ControlledFieldError error={errors.quantityStock} />
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
                        </div>
                        <div className="w-[15vw]">
                            <Label>Fotos</Label>
                            <ControlledMultipleFileInput name="files" control={control} />
                            <ControlledFieldError error={errors.files as FieldError} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Criar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
