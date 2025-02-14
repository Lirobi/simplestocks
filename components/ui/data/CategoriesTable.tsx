"use client"
import { getCategories } from "@/app/dashboard/products/add/actions";
import BaseButton from "../buttons/BaseButton";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Category } from "@prisma/client";
import EditCategoryPopup from "../popups/EditCategoryPopup";
import { addCategory, deleteCategory, updateCategory } from "./actions";
import BaseToast from "../toasts/BaseToast";


export default function CategoriesTable() {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [defaultCategories, setDefaultCategories] = useState([]);
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

    const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [currentAction, setCurrentAction] = useState("Add");
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const searchCategories = (search: string) => {
        setCategories(defaultCategories);
        const filteredCategories = defaultCategories.filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase())
        );
        setCategories(filteredCategories);
    };

    const handleSearchbarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        searchCategories(e.target.value);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories);
            setDefaultCategories(categories);
        }
        fetchCategories();
    }, []);


    const handleAddCategory = () => {
        setCurrentAction("Add");
        setName("New Category");
        setDescription("");
        setShowAddCategoryPopup(true);
    }

    const handleEditCategory = (category: Category) => {
        setCurrentAction("Edit");
        setName(category.name);
        setDescription(category.description);
        setShowAddCategoryPopup(true);
    }


    const handleDeleteCategory = async (category: Category) => {
        try {
            await deleteCategory(category.id);
            setCategories(categories.filter((c) => c.id !== category.id));
            setDefaultCategories(defaultCategories.filter((c) => c.id !== category.id));
            setToast({ message: "Category deleted successfully", type: "success" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } catch (error) {
            setToast({ message: "Error deleting category", type: "error" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    }

    const handleAddCategoryConfirm = async () => {
        if (currentAction === "Add") {
            const newCategory = await addCategory(name, description);
            setCategories([...categories, newCategory]);
            setDefaultCategories([...defaultCategories, newCategory]);
            setShowAddCategoryPopup(false);
            setToast({ message: "Category added successfully", type: "success" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } else if (currentAction === "Edit") {
            await updateCategory(categoryToEdit.id, name, description);
            setCategories(categories.map((c) => c.id === categoryToEdit.id ? { ...c, name, description } : c));
            setDefaultCategories(defaultCategories.map((c) => c.id === categoryToEdit.id ? { ...c, name, description } : c));
            setShowAddCategoryPopup(false);
            setToast({ message: "Category updated successfully", type: "success" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">

                <h1 className="text-3xl font-bold p-10 pb-4">Categories</h1>
                <BaseButton onClick={() => { handleAddCategory(); setShowAddCategoryPopup(true) }}>Add Category</BaseButton>
            </div>
            {toast && <BaseToast message={toast.message} type={toast.type} />}
            {showAddCategoryPopup && <EditCategoryPopup action={currentAction as "Add" | "Edit"} onClose={() => setShowAddCategoryPopup(false)} onConfirm={handleAddCategoryConfirm} name={name} description={description} setName={setName} setDescription={setDescription} />}
            <div className="w-full px-10 mb-4 sticky top-2 z-20 ">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products"
                        value={search}
                        onChange={handleSearchbarChange}
                        className="border-2 dark:border-line-dark border-line-light dark:bg-background-dark bg-background-light rounded-md p-2 w-full pr-10"
                    />
                    <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
            <div className="w-full px-10">
                <table className="w-full h-fit">
                    <thead className="top-0 ">
                        <tr>
                            <th className="w-fit p-2 cursor-pointer"></th>
                            <th className="w-fit p-2 cursor-pointer"></th>
                            <th className="w-fit p-2 cursor-pointer">id</th>
                            <th className="w-fit p-2 cursor-pointer">Name</th>
                            <th className="w-fit p-2 cursor-pointer">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-line group relative">
                                <td className="w-fit mr-1"
                                    onClick={() => { handleEditCategory(category); setCategoryToEdit(category) }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9 p-1.5 text-foreground-light dark:text-foreground-dark opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:group-hover:bg-background-dark light:group-hover:bg-backgroundTertiary-light rounded-md"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5l4 4-9 9H12v-4.5l9-9z" />
                                        <path d="M3 21v-3.5L15.5 4l3.5 3.5L7.5 21H3z" />
                                    </svg>
                                </td>
                                <td className="w-fit"
                                    onClick={() => { handleDeleteCategory(category) }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:group-hover:bg-background-dark light:group-hover:bg-backgroundTertiary-light rounded-md"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18M9 6v12m3-12v12m-6 0h12" />
                                        <path d="M4 6h16l-1 12H5L4 6z" />
                                    </svg>
                                </td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{category.id}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-wrap break-all max-w-[25vw] text-center">{category.name}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-wrap break-all max-w-[25vw] text-center">{category.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}