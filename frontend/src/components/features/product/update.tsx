import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ControlledFieldError, {
    ControlledMultipleFileInput,
    ControlledNumberInput,
    ControlledTextInput
} from "@/components/ui/controlled-form";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CreateProductDTO, CreateProductSchema, Product } from "@/lib/types/product";
import { filenameSplit } from "@/lib/utils";
import { useDeleteFiles, useUploadFiles } from "@/services/cdn.service";
import { useUpdateProduct } from "@/services/product.service";

type UpdateProductFormData = z.infer<typeof CreateProductSchema>;

interface UpdateProductModalProps {
    product: Product;
}

export function UpdateProductModal({ product }: UpdateProductModalProps) {
    const [open, setOpen] = useState(false);

    const oldImages = product.images.map(img => filenameSplit(img));

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<UpdateProductFormData>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            brand: product.brand,
            discount: product.discount,
            quantityStock: product.quantityStock,
            files: [],
        },
    });

    const uploadFiles = useUploadFiles();
    const deleteFiles = useDeleteFiles();
    const updateProduct = useUpdateProduct();

    async function fetchImage(url: string) {
        const res = await fetch(url);
        const blob = await res.blob();

        return new File([blob], filenameSplit(url), { type: "image/jpeg" })
    }

    async function setupImages() {
        const files = await Promise.all(product.images.map(img => fetchImage(img)));
        setValue("files", files);
    }

    async function onSubmit(data: UpdateProductFormData) {
        const oldFileNames = oldImages.map(url => filenameSplit(url));

        const keptFiles = data.files.filter(f => oldFileNames.includes(f.name));
        const newFiles = data.files.filter(f => !oldFileNames.includes(f.name));
        const removedImages = oldImages.filter(url => !data.files.find(f => f.name === filenameSplit(url)));

        const payload: CreateProductDTO = {
            name: data.name,
            description: data.description,
            brand: data.brand,
            discount: data.discount,
            images: [],
            price: data.price,
            quantityStock: data.quantityStock,
        };

        // 1. Upload de novas imagens
        if (newFiles.length > 0) {
            await uploadFiles.mutateAsync(newFiles, {
                onSuccess: (r) => {
                    payload.images = [
                        ...keptFiles.map(f => oldImages.find(url => filenameSplit(url) === f.name)!),
                        ...r,
                    ];
                }
            })
        } else {
            payload.images = keptFiles.map(f => oldImages.find(url => filenameSplit(url) === f.name)!);
        }

        // 2. Envia payload
        updateProduct.mutate({ id: product.id, data: payload });

        // 3. Remove do CDN se necessário
        if (removedImages.length > 0) {
            deleteFiles.mutate(removedImages);
        }

        setOpen(false);
        reset();
    }


    useEffect(() => {
    if (open) {
        reset({
            name: product.name,
            description: product.description,
            price: product.price,
            brand: product.brand,
            discount: product.discount,
            quantityStock: product.quantityStock,
            files: [],
        });

        setupImages();
    }
}, [open]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Editar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
                <DialogHeader>
                    <DialogTitle>Atualizar produto</DialogTitle>
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
