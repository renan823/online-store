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
import { useEffect, useRef, useState } from "react";
import { CreateProductDTO, CreateProductSchema, Product } from "@/lib/types/product";
import { filenameSplit } from "@/lib/utils";
import { useDeleteFiles, useUploadFiles } from "@/services/cdn.service";
import { useUpdateProduct } from "@/services/product.service";
import { useAuth } from "@/context/auth";

type UpdateProductFormData = z.infer<typeof CreateProductSchema>;

interface UpdateProductModalProps {
    product: Product;
}

export function UpdateProductModal({ product }: UpdateProductModalProps) {
    const { token } = useAuth()
    const [open, setOpen] = useState(false);

    const oldImageRefs = useRef<string[]>([]);

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<UpdateProductFormData>({
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

    const watchedFiles = watch("files");

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
        oldImageRefs.current = product.images.map(filenameSplit);
    }

    async function onSubmit(data: UpdateProductFormData) {
        if (!token) return;

        const currentFileNames = data.files.map(f => f.name);
        const originalImageMap = Object.fromEntries(product.images.map(img => [filenameSplit(img), img]));

        const keptFiles = data.files.filter(f => originalImageMap[f.name]);
        const newFiles = data.files.filter(f => !originalImageMap[f.name]);

        const removedImages = Object.keys(originalImageMap)
            .filter(name => !currentFileNames.includes(name))
            .map(name => originalImageMap[name]);

        const payload: CreateProductDTO = {
            name: data.name,
            description: data.description,
            brand: data.brand,
            discount: data.discount,
            images: [],
            price: data.price,
            quantityStock: data.quantityStock,
        };

        if (newFiles.length > 0) {
            await uploadFiles.mutateAsync(newFiles, {
                onSuccess: (r) => {
                    payload.images = [
                        ...keptFiles.map(f => originalImageMap[f.name]),
                        ...r.map(u => `http://localhost:5000/${u}`),
                    ];
                },
            });
        } else {
            payload.images = keptFiles.map(f => originalImageMap[f.name]);
        }

        updateProduct.mutate({ id: product.id, data: payload, token });

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

    useEffect(() => {
        const currentFiles = watchedFiles || [];
        const currentNames = currentFiles.map(f => f.name);

        const removed = oldImageRefs.current.filter(name => !currentNames.includes(name));
        const added = currentNames.filter(name => !oldImageRefs.current.includes(name));

        if (removed.length || added.length) {
            oldImageRefs.current = [
                ...oldImageRefs.current.filter(name => !removed.includes(name)),
                ...added,
            ];
        }
    }, [watchedFiles]);

    if (!token) {
        return <></>
    }

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
                        <Button type="submit">Atualizar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
