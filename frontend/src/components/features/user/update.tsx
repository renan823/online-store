import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ControlledFieldError, {
    ControlledCheckbox,
    ControlledEmailInput,
    ControlledTextInput
} from "@/components/ui/controlled-form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFetchUserById, useUpdateUser } from "@/services/user.service";
import { z } from "zod";
import { UpdateUserSchema, UpdateUserDTO, User } from "@/lib/types/user";
import { Edit } from "lucide-react";

type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;

type UserId  = {
    id: string
}

export function UpdateUserModal({ id }: UserId) {
    // State to control whether the dialog is open or not
    const [open, setOpen] = useState(false);
    //Fetch current user data only when the modal is opened
	const { isLoading, error, data } = useFetchUserById(id, {
        enabled: open,
        queryKey: ["user", id]
    });
    const user = data as User

    // Initialize react-hook-form with zod schema resolver
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(UpdateUserSchema),
    });
    const updateUser = useUpdateUser();

    // When user data is fetched, populate form fields
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("address", user.address);
            setValue("phone", user.phone);
            setValue("isAdmin", user.role === "admin");
        }
    }, [user, setValue]);

    async function onSubmit(data: UpdateUserFormData) {
        // Create the payload from form data
        const payload: UpdateUserDTO = {
            name: data.name,
            phone: data.phone,
            address: data.address,
            email: data.email,
            isAdmin: data.isAdmin
        }

        // Call the update user mutation, then close modal and reset form on success
        updateUser.mutate({id, user: payload}, {onSuccess: () => {
            setOpen(false);
            reset();
        }});
    };

    // Render loading/error state in modal
	if (isLoading || error || !user) {
		return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div>
                        <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary">
                            <Edit className="h-4 w-4 mr-1 md:mr-0" /> <span className="hidden md:inline">Editar</span>
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
			        <div className="flex items-center justify-center p-10">
				        <h1 className="text-2xl text-center">
					        {isLoading
						        ? 'Carregando...'
						        : error
							        ? `Erro: ${error.message}`
							        : 'Erro: Usuário inválido'}
				        </h1>
			        </div>
                </DialogContent>
            </Dialog>
		);
	}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary">
                        <Edit className="h-4 w-4 mr-1 md:mr-0" /> <span className="hidden md:inline">Editar</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[35vw] w-[35vw] sm:max-w-none">
                <DialogHeader>
                    <DialogTitle>Atualização de Usuário</DialogTitle>
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
                        <Button type="submit">Atualizar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
