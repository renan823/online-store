import { NavItem, SidebarNavigation } from '@/components/features/user/SidebarNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { OrdersPage } from '@/components/features/user/ordersPage'; 
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


function RouteComponent() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State for Informacao Pessoal
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // State for Pagamento
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
	const [cardCVV, setCardCVV] = useState("") 
	const [cardVal, setCardVal] = useState("")


    const [activeSection, setActiveSection] = useState("informacaoPessoal");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const navigationMenu: NavItem[] = [
        { id: "informacaoPessoal", label: "Informação pessoal" },
        { id: "pedidos", label: "Pedidos" },
        { id: "pagamento", label: "Pagamento" },
        { id: "logout", label: "Logout" },
    ];

    // Handlers for Informacao Pessoal
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);

    const handleSubmitInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Dados pessoais a serem salvos:", { name, email, phone, address });
        // Lógica para salvar dados pessoais
    };

    // Handlers for Pagamento
    const handleChangeCardHolderName = (e: React.ChangeEvent<HTMLInputElement>) => setCardHolderName(e.target.value);
    const handleChangeCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value);
	const handleChangeCardCVV = (e: React.ChangeEvent<HTMLInputElement>) => setCardCVV(e.target.value);
	const handleChangeCardVal = (e: React.ChangeEvent<HTMLInputElement>) => setCardVal(e.target.value);



    const handleSavePayment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Dados de pagamento a serem salvos:", { cardHolderName, cardNumber });
        setCardHolderName(""); 
        setCardNumber("");
    };

    const handleLogout = () => {
        logout();
        navigate({ to: '/', replace: true });
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-var(--header-height,80px))]">
                Faça login para acessar seu perfil.
            </div>
        );
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
                            <form className="space-y-6" onSubmit={handleSubmitInfo}>
                                <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Informações Pessoais</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor='name' className="text-sm font-medium">Nome</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Joãozinho"
                                            value={name}
                                            onChange={handleChangeName}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor='phone' className="text-sm font-medium">Telefone</Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            placeholder="(XX) XXXXX-XXXX"
                                            value={phone}
                                            onChange={handleChangePhone}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor='email' className="text-sm font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        value={email}
                                        onChange={handleChangeEmail}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor='address' className="text-sm font-medium">Endereço</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        placeholder=" Avenida Trabalhador são-carlense, 400 - Parque Arnold Schimidt."
                                        value={address}
                                        onChange={handleChangeAddress}
                                    />
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
                        <OrdersPage />
                    )}

                    {activeSection === "pagamento" && (
                        <div className="p-4 md:p-6 bg-card rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-8 text-center">Pagamento</h2>
                            <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSavePayment}>
                                <div className="space-y-1.5">
                                    <Label htmlFor='cardHolderName' className="text-sm font-medium">Nome do titular</Label>
                                    <Input
                                        id="cardHolderName"
                                        type="text"
                                        placeholder="Nome no cartão"
                                        value={cardHolderName}
                                        onChange={handleChangeCardHolderName}
                                        className="bg-input placeholder:text-muted-foreground" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor='cardNumber' className="text-sm font-medium">Número do cartão</Label>
                                    <Input
                                        id="cardNumber"
                                        type="text"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={cardNumber}
                                        onChange={handleChangeCardNumber}
                                        className="bg-input placeholder:text-muted-foreground"
                                    />
                                </div>
								<div className="space-y-1.5">
                                    <Label htmlFor='cardCVV' className="text-sm font-medium">CVV</Label>
                                    <Input
                                        id="cardCVV"
                                        type="text"
                                        placeholder="XXX"
                                        value={cardCVV}
                                        onChange={handleChangeCardCVV}
                                        className="bg-input placeholder:text-muted-foreground" 
                                    />
                                </div>

								<div className="space-y-1.5">
                                    <Label htmlFor='cardVal' className="text-sm font-medium">Validade</Label>
                                    <Input
                                        id="cardVal"
                                        type="text"
                                        placeholder="DD/MM/AAAA"
                                        value={cardVal}
                                        onChange={handleChangeCardVal}
                                        className="bg-input placeholder:text-muted-foreground" 
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