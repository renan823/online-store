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
        <div className="flex">
            <div>
                <img src="/assets/notebook.png"/>
            </div>
            <div>
                <h2>Produtos</h2>
                <p>Conheça nossos produtos</p>
                <Button>Explorar</Button>
            </div>
        </div>
    )
}

export function OfferBanner() {
    return (
        <div className="flex">
            <div>
                
            </div>
            <div>
                <img src="/assets/user.png"/>
            </div>
        </div>
    )
}