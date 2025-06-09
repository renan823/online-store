import { Navbar } from "@/components/ui/navbar";
import { AuthContextType } from "@/context/auth";
import { CartContextType } from "@/context/cart";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

interface RouterContext {
    auth: AuthContextType;
    cart: CartContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return (
            <>
                <header className="px-10">
                    <Navbar />
                </header>
                <main className="py-6 px-10">
                    <Outlet />
                </main>
                <Toaster />
            </>
        )
    }
})