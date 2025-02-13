import { getUser } from "@/app/login/actions";
import ProductsTable from "@/components/ui/data/ProductsTable";

export default async function ProductsPage() {
    return (
        <div className="w-full h-full overflow-hidden">
            <ProductsTable />
        </div>
    );
}