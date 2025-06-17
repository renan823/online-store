import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, Users, User, PackageSearch, ChartNoAxesColumn } from "lucide-react";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger
} from "@/components/ui/menubar";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";

export function Navbar() {
    const { getTotalItems } = useCart();
    const { user } = useAuth();
    const total = getTotalItems();

    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-rose-700/80 backdrop-blur-md text-white shadow-md rounded-b-2xl">
            <Link to="/" className="text-xl font-bold tracking-tight">CFR Tech</Link>

            {/* Links para desktop */}
            <div className="hidden md:flex gap-8 items-center">
                <Link to="/products" className="flex items-center gap-2 hover:text-rose-200">
                    <PackageSearch className="w-5 h-5" />
                    <span>Produtos</span>
                </Link>

                {user?.role === "admin" ? (
                    <Link to="/users" className="flex items-center gap-2 hover:text-rose-200">
                        <Users className="w-5 h-5" />
                        <span>Usuários</span>
                    </Link>
                ) : (
                    <Link to="/cart" className="relative flex items-center gap-2 hover:text-rose-200">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Carrinho</span>
                        {total > 0 && (
                            <span className="absolute -top-2 -right-3 bg-white text-rose-900 text-xs font-bold rounded-full px-1.5 py-0.5">
                                {total}
                            </span>
                        )}
                    </Link>
                )}

                {user?.role === "admin" ? (
                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-rose-200">
                        <ChartNoAxesColumn className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                ) : (
                    <></>
                )}

                <Link to="/user/profile" className="flex items-center gap-2 hover:text-rose-200">
                    <User className="w-5 h-5" />
                    <span>Perfil</span>
                </Link>
            </div>

            {/* Mobile menu */}
            <div className="flex md:hidden">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger className="p-1 text-white">
                            <Menu className="h-6 w-6" />
                        </MenubarTrigger>
                        <MenubarContent className="bg-white text-rose-900 shadow-lg rounded-md w-48">
                            <MenubarItem>
                                <Link to="/products" className="flex items-center gap-2">
                                    <PackageSearch className="w-4 h-4" />
                                    Produtos
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />

                            {user?.role === "admin" ? (
                                <MenubarItem>
                                    <Link to="/users" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Usuários
                                    </Link>
                                </MenubarItem>
                            ) : (
                                <MenubarItem>
                                    <Link to="/cart" className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Carrinho
                                        {total > 0 && (
                                            <span className="ml-auto text-xs font-bold bg-rose-100 text-rose-800 px-2 rounded-full">
                                                {total}
                                            </span>
                                        )}
                                    </Link>
                                </MenubarItem>
                            )}
                            <MenubarSeparator />


                            {user?.role === "admin" ? (
                                <MenubarItem>
                                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-rose-200">
                                        <ChartNoAxesColumn className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                </MenubarItem>
                            ) : (
                                <></>
                            )}

                            <MenubarItem>
                                <Link to="/user/profile" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Perfil
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </nav>
    );
}
