import { Navbar } from "@/components/ui/navbar";
import { AuthContextType } from "@/context/auth";
import { CartContextType } from "@/context/cart";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

interface RouterContext {
    auth: AuthContextType;
    cart: CartContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return (
            <>
                <header className="flex justify-between items-center py-1 px-6 bg-rose-600">
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <img src="/favicon.ico" className="size-12" />
                            <h2 className="font-bold text-xl text-white">Loja de eletrônicos</h2>
                        </div>
                    </Link>
                    <Navbar />
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
                <Toaster />
            </>
        )
    }
})