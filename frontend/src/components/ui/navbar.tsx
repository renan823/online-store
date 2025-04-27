import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ui/theme";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

export function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4">
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link to="/products">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Produtos
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/cart">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Carrinho
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/user/profile">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Perfil
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden md:flex ml-4">
                <ThemeToggle />
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