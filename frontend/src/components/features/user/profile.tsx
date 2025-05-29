// frontend/src/routes/user/profile.tsx
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarNavigation } from '@/components/features/user/SidebarNavigation'; 

interface NavItem {
  id: string;
  label: string;
  icon?: React.ElementType;
}

function ProfilePage() { 
    const { user, logout } = useAuth(); 
    const navigate = useNavigate(); 

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
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

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Dados a serem salvos:", { name, email, phone, address });
        //Tratar os dados
    };

    const handleLogout = () => {
        logout(); 
        navigate({ to: '/', replace: true }); 
    };



    return (
        <div className="flex min-h-[calc(100vh-var(--header-height,80px))] bg-background text-foreground font-sans">
            <SidebarNavigation
                navItems={navigationMenu}
                activeSection={activeSection}
                onNavClick={setActiveSection}
            />

            <main className="flex-1 p-8 md:p-12">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mx-auto mb-10 h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                        {/* Placeholder para imagem de perfil */}
                    </div>

                    {activeSection === "informacaoPessoal" && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor='name' className="text-sm font-medium">Nome</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome completo"
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
                                    placeholder="seuemail@exemplo.com"
                                    value={email}
                                    onChange={handleChangeEmail}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor='address' className="text-sm font-medium">Endereço</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Sua rua, número, bairro..."
                                    value={address}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="flex justify-center pt-4">
                                <Button type="submit" size="lg">
                                    Salvar Alterações
                                </Button>
                            </div>
                        </form>
                    )}
                    {activeSection === "pedidos" && (
                        <div className="text-center p-10 bg-card rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Meus Pedidos</h2>
                        </div>
                    )}
                    {activeSection === "pagamento" && (
                         <div className="text-center p-10 bg-card rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">Pagamento</h2>
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

//Observar
// Configuração da rota
export const Route = createFileRoute('/user/profile')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.user) { 
            throw redirect({
                to: '/user/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: ProfilePage, 
});