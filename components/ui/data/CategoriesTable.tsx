"use client"
import { getCategories } from "./actions";
import BaseButton from "../buttons/BaseButton";
import { useState, useEffect } from "react";
import { Category } from "@prisma/client";
import EditCategoryPopup from "../popups/EditCategoryPopup";
import { addCategory, deleteCategory, updateCategory } from "./actions";
import BaseToast from "../toasts/BaseToast";
import { getUser } from "@/app/login/actions";
import SearchBar from "../inputs/SearchBar";

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
            const user = await getUser();
            const categories = await getCategories(user.businessId);
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
            const user = await getUser();
            const newCategory = await addCategory(name, description, user.businessId);
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
            <div className="w-full px-10 mb-4 sticky top-2 z-20">
                <SearchBar
                    placeholder="Search categories"
                    value={search}
                    onChange={handleSearchbarChange}
                />
            </div>
            <div className="w-full px-10  ">
                <table className="w-full h-fit  ">
                    <thead className="top-0 ">
                        <tr>
                            <th className="max-w-5 p-2 cursor-pointer"></th>
                            <th className="w-fit p-2 cursor-pointer"></th>
                            <th className="w-fit p-2 cursor-pointer">id</th>
                            <th className="w-fit p-2 cursor-pointer">Name</th>
                            <th className="w-fit p-2 cursor-pointer">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-line group relative">
                                <td className="w-9 mr-1"
                                    onClick={() => { handleEditCategory(category); setCategoryToEdit(category) }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9 p-1.5 text-foreground-light dark:text-foreground-dark opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:group-hover:bg-backgroundTertiary-dark light:group-hover:bg-backgroundTertiary-light rounded-md"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13" />
                                        <path d="M9.5 11.5L17.5 3.5C18.3284 2.67157 19.6716 2.67157 20.5 3.5C21.3284 4.32843 21.3284 5.67157 20.5 6.5L12.5 14.5L8 16L9.5 11.5Z" />
                                    </svg>

                                </td>
                                <td className="w-9 1"
                                    onClick={() => { handleDeleteCategory(category) }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-9 w-9 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:group-hover:bg-backgroundTertiary-dark light:group-hover:bg-backgroundTertiary-light rounded-md"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" />
                                        <path d="M14 11V17M10 11V17" />
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