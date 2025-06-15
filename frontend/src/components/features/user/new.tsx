import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ControlledFieldError, {
    ControlledCheckbox,
    ControlledEmailInput,
    ControlledPasswordInput,
    ControlledTextInput
} from "@/components/ui/controlled-form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useCreateUser } from "@/services/user.service";
import { z } from "zod";
import { CreateUserSchema, CreateUserDTO } from "@/lib/types/user";
import { PlusCircle } from "lucide-react";

type CreateUserFormData = z.infer<typeof CreateUserSchema>;

export function NewUserModal() {
    // State to control whether the dialog is open or not
    const [open, setOpen] = useState(false);

    // Initialize react-hook-form with zod schema resolver
    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormData>({
        resolver: zodResolver(CreateUserSchema),
    });

    const createUser = useCreateUser();

    async function onSubmit(data: CreateUserFormData) {
        // Create the payload from form data
        const payload: CreateUserDTO = {
            name: data.name,
            phone: data.phone,
            address: data.address,
            email: data.email,
            password: data.password,
            isAdmin: data.isAdmin
        }

        // Call the create user mutation, then close modal and reset form on success
        createUser.mutate(payload, {onSuccess: () => {
            setOpen(false);
            reset();
        }});
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Adicionar Usuário
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
                <DialogHeader>
                    <DialogTitle>Cadastro de Usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-10">
                        <div className="w-[15vw] space-y-4">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <ControlledTextInput
                                    name="name"
                                    control={control}
                                    placeholder="Joãozinho"
                                    value=""
                                />
                                <ControlledFieldError error={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Telefone</Label>
                                <ControlledTextInput
                                    name="phone"
                                    control={control}
                                    placeholder="11 949735521"
                                    value=""
                                />
                                <ControlledFieldError error={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Endereço</Label>
                                <ControlledTextInput
                                    name="address"
                                    control={control}
                                    placeholder="Rua Jacinto Favoretto, 123"
                                    value=""
                                />
                                <ControlledFieldError error={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <ControlledEmailInput
                                    name="email"
                                    control={control}
                                    placeholder="abc@exemplo.com"
                                    value=""
                                />
                                <ControlledFieldError error={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Senha</Label>
                                <ControlledPasswordInput
                                    name="password"
                                    control={control}
                                    placeholder="***********"
                                    value=""
                                />
                                <ControlledFieldError error={errors.password} />
                            </div>

                            <div className="w-[15vw]">
                                <div className="flex gap-3">
                                    <Label>Admin</Label>
                                    <ControlledCheckbox
                                        name="isAdmin"
                                        control={control}
                                        value={false}
                                    />
                                </div>
                            </div>
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
