"use client";
import { useEffect, useState } from "react";
import SidebarDropdown from "./SidebarDropdown";
import { redirect } from "next/navigation";
import SidebarButton from "./SidebarButton";
import { getUser } from "@/app/login/actions";
export default function DashboardSidebar(defaultOpen: boolean | undefined = false) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(defaultOpen);

    const [isAdmin, setIsAdmin] = useState(false);

    const [sidebarDropdownItems, setSidebarDropdownItems] = useState([
        {
            title: "Products",
            items: [
                { label: "Products", onClick: () => redirect("/dashboard/products") },
                { label: "Add Product", onClick: () => redirect("/dashboard/products/add") }
            ]
        },
        {
            title: "Categories",
            items: [
                { label: "Categories", onClick: () => redirect("/dashboard/categories") },
                { label: "Add Category", onClick: () => redirect("/dashboard/categories/add") }
            ]
        }
    ]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user.role.toUpperCase() === "ADMIN") {
                setIsAdmin(true);
            }
        }
        fetchUser();
    }, []);
    return (
        <div className={`h-full flex flex-col transition-transform duration-300 w-fit ease-in-out bg-background shadow-md`}>
            <div className="flex gap-4 justify-between items-center h-full">
                <div className={`flex flex-col gap-2 transition-transform duration-300 h-full ease-in-out  ${isSidebarOpen ? "opacity-100 inline-block p-2" : "opacity-0 hidden"}`}>
                    <SidebarButton title="Home" onClick={() => redirect("/dashboard")} />
                    <SidebarButton title="Products" onClick={() => redirect("/dashboard/products")} />
                    <SidebarButton title="Categories" onClick={() => redirect("/dashboard/categories")} />
                    {isAdmin && (
                        <SidebarButton title="Management" onClick={() => redirect("/dashboard/business")} />
                    )}
                    {/* isSidebarOpen && sidebarDropdownItems.map((item) => (
                        <SidebarDropdown key={item.title} title={item.title} items={item.items} />
                    )) */}
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="transition-all duration-500 h-full min-h-fit hover:bg-backgroundTertiary-light dark:hover:bg-backgroundTertiary-dark my-2 rounded-lg">
                    <div className="flex justify-end items-center px-2 text-foreground-light dark:text-foreground-dark ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`mb-1 transition-transform duration-500 ${isSidebarOpen ? '' : 'rotate-180'}`}
                        >
                            <path d="M16 4L8 12L16 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                </button>
            </div>
        </div >
    );
}