"use client";

import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
import BaseTextArea from "@/components/ui/inputs/BaseTextArea";
import BaseNumberInput from "@/components/ui/inputs/BaseNumberInput";
import BaseSelect from "@/components/ui/inputs/BaseSelect";
import { useState, useEffect } from "react";

import { addProduct, getCategories } from "./actions";
import { Category } from "@prisma/client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import { redirect } from "next/navigation";


export default function AddProduct() {
    const [categories, setCategories] = useState<Category[]>([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");



    const fetchCategories = async () => {
        const categories = await getCategories();
        setCategories(categories);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddProduct = async () => {
        if (name === "" || price === 0 || quantity === 0 || category === "" || description === "") {
            setError("Please fill all the fields : " + name + " " + price + " " + quantity + " " + category + " " + description);
            return;
        }
        const product = await addProduct(name, price, quantity, category, description);
        if (product) {
            redirect("/dashboard/products");
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <h1 className="text-3xl font-bold p-10 pb-4">Add Product</h1>
            <form className="w-full px-10">
                <div className="flex w-full gap-4">
                    <BaseFormInput label="Name" name="name" type="text" className="w-full" placeholder="Enter product name" onChange={(e) => setName(e.target.value)} />
                    <BaseNumberInput label="Price" name="price" className="max-w-fit" onChange={(e) => setPrice(parseInt(e.target.value))} />
                    <BaseNumberInput label="Quantity" name="quantity" className="max-w-fit" onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    <BaseSelect label="Category" name="category" className="max-w-fit" options={categories.map((category) => ({ label: category.name, value: category.id.toString() }))} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <BaseTextArea label="Description" name="description" placeholder="Enter product description" onChange={(e) => setDescription(e.target.value)} />
                <BaseButton className="w-full py-4 text-xl font-bold" onClick={handleAddProduct}>Add Product</BaseButton>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}