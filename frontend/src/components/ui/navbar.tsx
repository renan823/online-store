import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

export function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4">
            <div className="hidden md:flex gap-6">
                <Link className="text-white font-bold hover:text-slate-300" to="/products">
                    <h3>Produtos</h3>
                </Link>
                   
                <Link className="text-white font-bold hover:text-slate-300" to="/cart">
                    <h3>Carrinho</h3>     
                </Link>
                   
                <Link className="text-white font-bold hover:text-slate-300" to="/user/profile">
                    <h3>Perfil</h3>
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