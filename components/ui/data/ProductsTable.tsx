"use client";
import { useEffect } from "react";
import { Category } from "@prisma/client";
import { Product } from "@prisma/client";
import { useState } from "react";
import { getProducts, getCategories, deleteProduct, changeProductQuantity } from "./actions";
import ContextMenu from "../contextmenus/ContextMenu";
import BaseToast from "../toasts/BaseToast";
import NumberPopup from "../popups/NumberPopup";
import { redirect } from "next/navigation";
import BaseButton from "../buttons/BaseButton";

export default function ProductsTable() {
    const [defaultProducts, setDefaultProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sortConfig, setSortConfig] = useState<{ column: string, direction: 'asc' | 'desc' } | null>(null);

    const [search, setSearch] = useState("");

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

    const [quantity, setQuantity] = useState(0);
    const [showNumberPopup, setShowNumberPopup] = useState(false);
    const [numberPopupMessage, setNumberPopupMessage] = useState("");
    const [numberPopupSign, setNumberPopupSign] = useState<"+" | "-">("+");


    const handleProductsRowContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, product: Product) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        // Calculate position relative to the viewport
        const x = e.pageX;
        const y = e.pageY;

        setContextMenuPosition({ x, y });
        setSelectedProduct(product);
        setShowContextMenu(true);
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            setShowContextMenu(false);
        };

        const handleContextMenu = (e: MouseEvent) => {
            if (!showContextMenu) return;
            e.preventDefault();
            setShowContextMenu(false);
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [showContextMenu]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProducts();
                const categories = await getCategories();
                setProducts(products);
                setDefaultProducts(products);
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchProducts();
    }, []);

    const orderBy = (column: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.column === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedProducts = [...products].sort((a, b) => {
            let comparison = 0;
            if (column === "id") {
                comparison = a.id - b.id;
            } else if (column === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (column === "unitPrice") {
                comparison = a.unitPrice - b.unitPrice;
            } else if (column === "description") {
                comparison = (a.description || '').localeCompare(b.description || '');
            } else if (column === "quantity") {
                comparison = a.quantity - b.quantity;
            } else if (column === "categoryId") {
                comparison = (a.categoryId || 0) - (b.categoryId || 0);
            } else if (column === "supplierId") {
                comparison = (a.supplierId || 0) - (b.supplierId || 0);
            }
            return direction === 'asc' ? comparison : -comparison;
        });

        setSortConfig({ column, direction });
        setProducts(sortedProducts);
    };

    const searchProducts = (search: string) => {
        setProducts(defaultProducts);
        const filteredProducts = defaultProducts.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
        setProducts(filteredProducts);
    };

    const handleSearchbarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        searchProducts(e.target.value);
    };

    const getSortIcon = (column: string) => {
        if (sortConfig?.column !== column) return null;
        return sortConfig.direction === 'asc' ? ' ↓' : ' ↑';
    };

    const handleChangeProductQuantity = async (sign: "+" | "-") => {
        const newQuantity = sign === "+" ? selectedProduct.quantity + quantity : selectedProduct.quantity - quantity;
        if (newQuantity > selectedProduct.quantity && sign === "-") {
            setToast({ message: "Quantity is greater than the stock", type: "error" });
        } else {
            setShowNumberPopup(false);
            try {
                await changeProductQuantity(selectedProduct.id, newQuantity);
                setProducts(products.map((product) => product.id === selectedProduct.id ? { ...product, quantity: newQuantity } : product));
                setToast({ message: `Removed ${quantity} from stock`, type: "success" });
            } catch (error) {
                setToast({ message: "Error removing product from stock", type: "error" });
            }
        }
    };



    const handleAddToStock = (product: Product) => {
        console.log("Add to stock", product);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product.id !== id));
            setToast({ message: "Product deleted successfully", type: "success" });
        } catch (error) {
            setToast({ message: "Error deleting product", type: "error" });
        }

        setTimeout(() => {
            setToast(null);
        }, 3000);

    };

    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">

                <h1 className="text-3xl font-bold p-10 pb-4">Products</h1>
                <BaseButton onClick={() => redirect("/dashboard/products/add")}>Add Product</BaseButton>
            </div>
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
            <div className="flex-1 px-10 pb-32">
                <style jsx global>{`
                    ::-webkit-scrollbar {
                        width: 10px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                `}</style>
                <div className="relative">
                    {showContextMenu && selectedProduct && (
                        <ContextMenu
                            actions={[
                                {
                                    label: "Remove from stock", onClick: () => {
                                        setNumberPopupMessage("Decrease stock");
                                        setShowNumberPopup(true);
                                    }
                                },
                                {
                                    label: "Add to stock", onClick: () => {
                                        setNumberPopupMessage("Increase stock");
                                        setShowNumberPopup(true);
                                    }
                                },
                                {
                                    label: "Edit", onClick: () => {
                                        redirect(`/dashboard/products/edit/${selectedProduct.id}`)
                                    }
                                },
                                { label: "Delete", onClick: () => handleDeleteProduct(selectedProduct.id) }
                            ]}
                            coordinates={contextMenuPosition}
                        />
                    )}
                    {toast && <BaseToast message={toast.message} type={toast.type} />}
                    {showNumberPopup && <NumberPopup message={numberPopupMessage} onClose={() => setShowNumberPopup(false)} setNumber={setQuantity} onConfirm={() => handleChangeProductQuantity(numberPopupSign)} />}
                    <table className="w-full h-fit">
                        <thead className="top-0 ">
                            <tr>
                                <th className="w-fit p-2 cursor-pointer"></th>
                                <th className="w-fit p-2 cursor-pointer" onClick={() => orderBy("id")}>
                                    <button className="text-sm">ID{getSortIcon("id")}</button>
                                </th>
                                <th className="w-fit p-2 cursor-pointer" onClick={() => orderBy("name")}>
                                    Name{getSortIcon("name")}
                                </th>
                                <th className="w-fit p-2 cursor-pointer text-nowrap" onClick={() => orderBy("unitPrice")}>
                                    Unit Price{getSortIcon("unitPrice")}
                                </th>
                                <th className="w-fit p-2 cursor-pointer" onClick={() => orderBy("description")}>
                                    Description{getSortIcon("description")}
                                </th>
                                <th className="w-fit p-2 cursor-pointer" onClick={() => orderBy("quantity")}>
                                    Quantity{getSortIcon("quantity")}
                                </th>
                                <th className="w-fit p-2 cursor-pointer" onClick={() => orderBy("categoryId")}>
                                    Category{getSortIcon("categoryId")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-line group relative"
                                    onContextMenu={(e) => handleProductsRowContextMenu(e, product)}
                                >
                                    <td className="flex justify-center items-center py-2 px-1.5 cursor-pointer rounded-md opacity-0 group-hover:opacity-100 dark:group-hover:bg-backgroundTertiary-dark light:group-hover:bg-backgroundTertiary-light transition-opacity w-fit"
                                        onClick={(e: React.MouseEvent<HTMLTableCellElement>) => handleProductsRowContextMenu(e, product)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="py-full h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{product.id}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{product.name}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2">{product.unitPrice}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{product.description}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2">{product.quantity}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2"><p className="text-sm bg-primary rounded-md m-2 px-2">{categories.find((category) => category.id === product.categoryId)?.name}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}