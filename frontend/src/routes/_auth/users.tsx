// frontend/src/routes/_auth/users.tsx
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ban, Search } from 'lucide-react';
import { useState } from 'react';
import { NewUserModal } from '@/components/features/user/new';
import { DeleteUserModal } from '@/components/features/user/delete';
import { UpdateUserModal } from '@/components/features/user/update';
import { useFetchUsers } from '@/services/user.service';

export const Route = createFileRoute('/_auth/users')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.user) {
            throw redirect({
                to: '/user/login',
                search: {
                    redirect: location.href,
                },
            });
        }
        if (context.auth.user.role !== "admin") {
            throw redirect({
                to: '/user/profile', 
            });
        }
    },
    component: UsersListPage,
});

function UsersListPage() {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    //Fetch users
	const { isLoading, error, data: users } = useFetchUsers();

    if (user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center h-80 p-10 text-red-500">
                <Ban className="w-12 h-12 mb-4" />
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground mt-2">
                    Você não tem permissão para acessar esta página.
                </p>
                <Button onClick={() => navigate({ to: '/' })} className="mt-6">
                    Voltar para a Página Inicial
                </Button>
            </div>
        );
    }
    
    // Render loading/error state
	if (isLoading || error || users == undefined) {
		return (
			<div className="flex items-center justify-center p-10">
				<h1 className="text-2xl text-center">
					{isLoading
						? 'Carregando...'
						: error
							? `Erro: ${error.message}`
							: 'Erro: Usuário inválido'}
				</h1>
			</div>
		);
    }

    const filteredUsers = users?.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="p-6 md:p-8 bg-background text-foreground">
            {/* Seção da Lista de Usuários */}
            <div className="bg-card p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Lista de Usuários</h2>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center w-full md:w-auto">
                        <Input
                            type="text"
                            placeholder="Buscar usuário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm h-10"
                        />
                        <Button variant="ghost" size="icon" className="ml-2 text-muted-foreground hover:text-primary">
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                    <NewUserModal/>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted">
                                <TableHead className="w-[80px] text-center font-semibold">ID</TableHead>
                                <TableHead className="font-semibold">Nome</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold">Telefone</TableHead>
                                <TableHead className="w-[100px] text-center font-semibold">Tipo</TableHead>
                                <TableHead className="w-[150px] text-center font-semibold">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((u) => (
                                <TableRow key={u.id} className="hover:bg-muted/30">
                                    <TableCell className="text-center font-medium">{u.id}</TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">{u.phone}</TableCell>
                                    <TableCell className="text-center">{u.role.toUpperCase()}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <UpdateUserModal id={u.id}/>
                                        <DeleteUserModal id={u.id}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {filteredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground py-10">
                        Nenhum usuário encontrado com os critérios de busca.
                    </p>
                )}
            </div>
        </div>
    );
}