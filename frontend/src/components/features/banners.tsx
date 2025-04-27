import { Button } from "@/components/ui/button"

export function HeaderBanner() {
    return (
        <div>
            <img src="/assets/banner.png"/>
        </div>
    )
}

export function ProductsBanner() {
    return (
        <div className="flex w-[80vw] gap-20">
            <div className="w-[100%]">
                <img src="/assets/notebook.png"/>
            </div>
            <div className="flex w-[100%] justify-center items-center">
                <div className="space-y-4 w-1/2">
                    <h2 className="text-5xl font-bold">Produtos</h2>
                    <p className="font-bold text-xl">Conheça nossos produtos</p>
                    <Button className="text-lg px-5 py-2">Explorar</Button>
                </div>
            </div>
        </div>
    )
}

export function OfferBanner() {
    return (
        <div className="flex w-[80vw] gap-20">
            <div className="flex w-[100%] justify-center items-center">
                <div className="space-y-4 w-1/2">
                    <h2 className="text-5xl font-bold">Ofertas</h2>
                    <p className="font-bold text-xl">Aproveite descontos imperdíveis</p>
                    <Button className="text-lg px-5 py-2">Explorar</Button>
                </div>
            </div>
            <div className="w-[100%]">
                <img src="/assets/user.png"/>
            </div>
        </div>
    )
}