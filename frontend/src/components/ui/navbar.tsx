import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { getTotalItems } = useCart();

    const total = getTotalItems();

    return (
        <nav className="flex items-center justify-between p-4">
            <div className="hidden md:flex gap-6">
                <Link to="/products">
                    <h3 className="text-white font-bold hover:text-slate-300">Produtos</h3>
                </Link>

                <Link to="/cart" className="flex jutsify-evenly items-center">
                    <h3 className="text-white font-bold hover:text-slate-300">Carrinho</h3>
                    {total === 0 ? <></> : <span className="ml-2 size-5 text-sm rounded-sm font-bold bg-white text-center">{total}</span>}
                </Link>

                <Link to="/user/profile">
                    <h3 className="text-white font-bold hover:text-slate-300">Perfil</h3>
                </Link>
            </div>

            <div className="flex md:hidden ml-auto">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger className="p-1">
                            <Menu className="h-[1.2rem] w-[1.2rem]" />
                        </MenubarTrigger>
                        <MenubarContent className="m-4">
                            <MenubarItem>
                                <Link to="/products">
                                    Produtos
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <Link to="/cart">
                                    Carrinho
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <Link to="/user/profile">
                                    Perfil
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </nav>
    )
}