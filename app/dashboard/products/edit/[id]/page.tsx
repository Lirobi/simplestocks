"use client"
import { getProduct, updateProduct } from "./actions";
import { useState, useEffect } from "react";
import { Category, Product } from "@prisma/client";
import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
import { useParams } from "next/navigation";
import BaseSelect from "@/components/ui/inputs/BaseSelect";
import { getCategories } from "@/components/ui/data/actions";
import BaseTextArea from "@/components/ui/inputs/BaseTextArea";
import BaseButton from "@/components/ui/buttons/BaseButton";
import Link from "next/link";
export default function EditProductPage() {

    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProduct(params.id as string);
            setProduct(product);
        }

        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories);
        }

        fetchProduct();
        fetchCategories();
    }, []);


    const handleEditProduct = async () => {
        const updatedProduct = await updateProduct(product?.id, product);
        setProduct(updatedProduct);
    }


    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <Link href="/dashboard/products" className="text-primary pl-10 pt-4 underline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 19l-7-7 7-7" />
                </svg>
                Back to products
            </Link>


            <h1 className="text-3xl font-bold p-10 pb-4">Edit Product</h1>
            <div className="w-full h-full flex flex-col p-10">

                <div className="flex w-full gap-4">
                    <BaseFormInput label="Name" className="" value={product?.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                    <BaseFormInput label="Price" className="" value={product?.unitPrice.toString()} onChange={(e) => setProduct({ ...product, unitPrice: parseInt(e.target.value) })} />
                    <BaseFormInput label="Quantity" className="" value={product?.quantity.toString()} onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })} />
                    <BaseSelect label="Category" className="" value={product?.categoryId.toString()} onChange={(e) => setProduct({ ...product, categoryId: parseInt(e.target.value) })} options={categories.map((category) => ({ label: category.name, value: category.id.toString() }))} />
                </div>
                <BaseTextArea label="Description" className="w-full" value={product?.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
                <BaseButton className="w-full py-4 text-xl font-bold" onClick={handleEditProduct}>Edit Product</BaseButton>
            </div>
        </div>
    );
}