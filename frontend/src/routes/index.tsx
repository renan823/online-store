import { HeaderBanner, OfferBanner, ProductsBanner } from "@/components/features/banners"
import { Separator } from "@/components/ui/separator"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <HeaderBanner/>
           
            <Separator className="my-10 size-1" />
            <div className="flex w-full justify-center my-2">
                <ProductsBanner/>
            </div>
            <div className="flex w-full justify-center my-2">
                <OfferBanner/>
            </div>
        </div>
    )
}