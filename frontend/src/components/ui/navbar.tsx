import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ui/theme";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export function Navbar() {
    return (
        <NavigationMenu>
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
                <NavigationMenuItem>
                    <ThemeToggle/>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}