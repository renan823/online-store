import { Navbar } from "@/components/ui/navbar";
import { ThemeProvider } from "@/components/ui/theme";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <ThemeProvider>
                    <header className="flex justify-between items-center py-2 px-6">
                        <Link to="/">
                            <div className="flex items-center gap-2">
                                <img src="/favicon.ico" className="size-12" />
                                <h2 className="font-bold text-xl">Loja de eletrônicos</h2>
                            </div>
                        </Link>
                        <Navbar />
                    </header>
                    <main className="px-6">
                        <Outlet />
                    </main>
                    <Toaster />
                </ThemeProvider>
            </>
        )
    }
})