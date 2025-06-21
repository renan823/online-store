import { NavItem, SidebarNavigation } from '@/components/features/user/SidebarNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { OrdersPage } from '@/components/features/user/ordersPage'; 
import { useFetchPaymentInfoById, useUpdatePaymentInfo, useUpdatePersonalInfo } from '@/services/user.service';
import { PaymentInfo, UpdatePaymentInfoDTO, UpdatePaymentInfoSchema, UpdatePersonalInfoDTO, UpdatePersonalInfoSchema } from '@/lib/types/user';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledFieldError, { ControlledTextInput } from '@/components/ui/controlled-form';

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
type UpdatePaymentInfoFormData = z.infer<typeof UpdatePaymentInfoSchema>;

function RouteComponent() {
    const { user, token, logout } = useAuth();
    const updatePersonalInfo = useUpdatePersonalInfo()
    const updatePaymentInfo = useUpdatePaymentInfo()
    const navigate = useNavigate();

    // Initialize react-hook-form with zod schema resolver for personal info form
    const { control: control1, handleSubmit: handleSubmit1, setValue: setValue1, formState: { errors: errors1 } } = useForm<UpdatePersonalInfoFormData>({
        resolver: zodResolver(UpdatePersonalInfoSchema),
    });

    // Initialize react-hook-form with zod schema resolver for payment info form
    const { control: control2, handleSubmit: handleSubmit2, setValue: setValue2, formState: { errors: errors2 } } = useForm<UpdatePaymentInfoFormData>({
        resolver: zodResolver(UpdatePaymentInfoSchema),
    });

    // State for managing the current profile section
    const [activeSection, setActiveSection] = useState("informacaoPessoal");

    // When the component mounts, populate the user info fields
    useEffect(() => {
        if (user) {
            setValue1("name", user.name);
            setValue1("address", user.address);
            setValue1("phone", user.phone);
        }
    }, [user, setValue1]);

    //Navigation sections
    const navigationMenu: NavItem[] = [
        { id: "informacaoPessoal", label: "Informação pessoal" },
        { id: "pedidos", label: "Pedidos" },
        { id: "pagamento", label: "Pagamento" },
        { id: "logout", label: "Logout" },
    ];

    // Submit handler for personal info section
    const onSubmitPersonalInfo = (data: UpdatePersonalInfoFormData) => {
        if(!user || !token) return;

        const payload: UpdatePersonalInfoDTO = {
            name: data.name,
            phone: data.phone,
            address: data.address,
        }
        updatePersonalInfo.mutate({id: user.id, user: payload, token});
    };

    // Submit handler for payment info section
    const onPaymentInfoSubmit = (data: UpdatePaymentInfoFormData) => {
        if(!user || !token) return;

        const payload: UpdatePaymentInfoDTO = {
            cardHolderName: data.cardHolderName,
            cardNumber: data.cardNumber
        }
        updatePaymentInfo.mutate({id: user.id, payment: payload, token});
    };

    const handleLogout = () => {
        logout();
        navigate({ to: '/', replace: true });
    };
    // Fetches payment info belonging to the logged user
    const { isLoading, error, data } = useFetchPaymentInfoById(user.id, token, {
        enabled: activeSection == "pagamento" && user != null,
        queryKey: ["payment"]
    });

    // If the request is successful, populates the corresponding fields
    const paymentInfo = data as PaymentInfo
    if(paymentInfo){
        setValue2("cardHolderName", paymentInfo.cardHolderName)
        setValue2("cardNumber", paymentInfo.cardNumber)
    }
    

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,80px))]">
                Faça login para acessar seu perfil.
            </div>
        );
    }

    // If the request is not successful (or is loading), show the request current state
	if (isLoading || error || !user) {
		return (
            <div className="flex">
                <SidebarNavigation
                    navItems={navigationMenu}
                    activeSection={activeSection}
                    onNavClick={setActiveSection}
                />
                <main className="flex-1 flex-col p-6 md:p-10 overflow-y-auto">
                    <div className="mx-auto w-full max-w-2xl"> 
                        <div>
			                <h1 className="text-2xl text-center">
			                    {isLoading
					                ? 'Carregando...'
					                : error
						                ? `Erro: ${error.message}`
						                : 'Erro: Usuário inválido'}
			                </h1>
		                </div>
                    </div>
                </main>
            </div>
        )
    }


    return (
        <div className="flex min-h-[calc(100vh-var(--header-height,80px))] bg-background text-foreground">
            <SidebarNavigation
                navItems={navigationMenu}
                activeSection={activeSection}
                onNavClick={setActiveSection}
            />

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="mx-auto w-full max-w-2xl"> 

                    {activeSection === "informacaoPessoal" && (
                        <>
                            <div className="mx-auto mb-8 h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <span className="text-3xl font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit1(onSubmitPersonalInfo)}>
                                <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Informações Pessoais</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor='name' className="text-sm font-medium">Nome</Label>
                                        <ControlledTextInput
                                            name="name"
                                            placeholder="Joãozinho"
                                            value={user.name}
                                            control={control1}
                                        />
                                        <ControlledFieldError error={errors1.name} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor='phone' className="text-sm font-medium">Telefone</Label>
                                        <ControlledTextInput
                                            name="phone"
                                            placeholder="(XX) XXXXX-XXXX"
                                            value={user.phone}
                                            control={control1}
                                        />
                                        <ControlledFieldError error={errors1.phone} />
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
                                        control={control1}
                                    />
                                    <ControlledFieldError error={errors1.address} />
                                </div>
                                <div className="flex justify-center md:justify-end pt-4">
                                    <Button type="submit" size="lg">
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}

                    {activeSection === "pedidos" && (
                        <OrdersPage id={user.id} />
                    )}

                    {activeSection === "pagamento" && (
                        <div className="p-4 md:p-6 bg-card rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-8 text-center">Pagamento</h2>
                            <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit2(onPaymentInfoSubmit)}>
                                <div className="space-y-1.5">
                                    <Label htmlFor='cardHolderName' className="text-sm font-medium">Nome do titular</Label>
                                    <ControlledTextInput
                                        name="cardHolderName"
                                        value=""
                                        placeholder="Nome no cartão"
                                        control={control2}
                                    />
                                    <ControlledFieldError error={errors2.cardHolderName} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor='cardNumber' className="text-sm font-medium">Número do cartão</Label>
                                    <ControlledTextInput
                                        name="cardNumber"
                                        value=""
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        control={control2}
                                    />
                                    <ControlledFieldError error={errors2.cardNumber} />
                                </div>
								<div className="space-y-1.5">
                                    <Label htmlFor='cardCVV' className="text-sm font-medium">CVV</Label>
                                    <Input
                                        id="cardCVV"
                                        value=""
                                        type="text"
                                        placeholder="XXX"
                                    />
                                </div>

								<div className="space-y-1.5">
                                    <Label htmlFor='cardVal' className="text-sm font-medium">Validade</Label>
                                    <Input
                                        id="cardVal"
                                        type="text"
                                        placeholder="DD/MM/AAAA"
                                        value=""
                                    />
                                </div>
                                <div className="flex justify-center pt-4">
                                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Salvar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeSection === "logout" && (
                        <div className="text-center p-10">
                            <h2 className="text-2xl font-semibold mb-4">Logout</h2>
                            <p className="text-muted-foreground mb-6">Tem certeza que deseja sair da sua conta?</p>
                            <Button onClick={handleLogout} variant="destructive" size="lg">
                                Confirmar Logout
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}