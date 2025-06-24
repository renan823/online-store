import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import { OrdersPage } from '@/components/features/user/orders';
import { useUpdatePersonalInfo } from '@/services/user.service';
import { UpdatePersonalInfoSchema } from '@/lib/types/user';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledFieldError, { ControlledTextInput } from '@/components/ui/controlled-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';

export const Route = createFileRoute('/user/profile')({
    beforeLoad: ({ context, location }) => {
        if (context.auth.user === null) {
            throw redirect({
                to: '/user/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: RouteComponent,
})

type UpdatePersonalInfoFormData = z.infer<typeof UpdatePersonalInfoSchema>;

function RouteComponent() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    function onLogout() {
        logout();
        navigate({ to: '/', replace: true });
    };

    if (!user || !token) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div className='p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <Avatar className='size-15'>
                            <AvatarFallback className='font-bold text-xl'>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h1 className='text-lg font-bold'>Olá, {user.name}</h1>
                    </div>
                    <div className='flex justify-between items-center'>
                        <Button onClick={onLogout}>Logout <LogOut /></Button>
                    </div>
                </div>
                <Separator className='mt-2 mb-4'/>
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                        <EditProfile/>
                    </div>
                    <div className='border-1 h-[60vh]'></div>
                    <div className='w-1/2'>
                        <OrdersPage token={token} userId={user.id}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditProfile() {
    const { user, token, update } = useAuth();
    const updatePersonalInfo = useUpdatePersonalInfo();

    // Initialize react-hook-form with zod schema resolver for personal info form
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<UpdatePersonalInfoFormData>({
        resolver: zodResolver(UpdatePersonalInfoSchema),
    });

    // When the component mounts, populate the user info fields
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("address", user.address);
            setValue("phone", user.phone);
        }
    }, [user, setValue]);


    function onSubmit(data: UpdatePersonalInfoFormData) {
        if (!user || !token) {
            return;
        }

        updatePersonalInfo.mutate({ id: user.id, token, user: data });
        update(data.name, data.phone, data.address)
    }

    if (!user) {
        return <></>
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="space-y-1.5">
                    <Label htmlFor='name' className="text-sm font-medium">Nome</Label>
                    <ControlledTextInput
                        name="name"
                        placeholder="Joãozinho"
                        value={user.name}
                        control={control}
                    />
                    <ControlledFieldError error={errors.name} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor='phone' className="text-sm font-medium">Telefone</Label>
                    <ControlledTextInput
                        name="phone"
                        placeholder="(XX) XXXXX-XXXX"
                        value={user.phone}
                        control={control}
                    />
                    <ControlledFieldError error={errors.phone} />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor='email' className="text-sm font-medium">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={user.email}
                    disabled
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor='address' className="text-sm font-medium">Endereço</Label>
                <ControlledTextInput
                    name="address"
                    placeholder=" Avenida Trabalhador são-carlense, 400 - Parque Arnold Schimidt."
                    value={user.address}
                    control={control}
                />
                <ControlledFieldError error={errors.address} />
            </div>
            <div className="flex justify-center md:justify-end pt-4">
                <Button type="submit" size="lg">
                    Salvar Alterações
                </Button>
            </div>
        </form>
    )
}