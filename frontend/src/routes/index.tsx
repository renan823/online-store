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
            <div className="my-4">
                <h1 className="text-lg font-bold">A melhor loja</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, similique id? Praesentium sunt pariatur facere odio voluptatum ipsa officia ratione repellendus cumque, quo autem consequatur quibusdam, non enim suscipit numquam.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, similique id? Praesentium sunt pariatur facere odio voluptatum ipsa officia ratione repellendus cumque, quo autem consequatur quibusdam, non enim suscipit numquam.</p>
            </div>
            <Separator className="my-4 size-1" />
            <ProductsBanner/>
            <OfferBanner/>
        </div>
    )
}