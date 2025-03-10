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
import { getUser } from "@/app/login/actions";
import SearchBar from "../inputs/SearchBar";
import TableContainer from "../containers/TableContainer";
import PopupWindowContainer from "../popups/PopupWindowContainer";
import ClickableText from "@/components/ui/buttons/ClickableText";

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
    const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);


    const handleProductsRowContextMenu = (e: React.MouseEvent<HTMLTableCellElement> | React.MouseEvent<HTMLTableRowElement>, product: Product) => {
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
                const user = await getUser();
                const products = await getProducts(user.businessId);
                const categories = await getCategories(user.businessId);
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

    const handleChangeProductQuantity = async () => {
        const sign = numberPopupSign;
        const newQuantity = sign === "+" ? selectedProduct.quantity + quantity : selectedProduct.quantity - quantity;
        if (newQuantity < 0) {
            setToast({ message: "Quantity cannot be negative", type: "error" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } else {
            setShowNumberPopup(false);
            try {
                await changeProductQuantity(selectedProduct.id, newQuantity);
                setProducts(products.map((product) => product.id === selectedProduct.id ? { ...product, quantity: newQuantity } : product));
                setToast({ message: `${selectedProduct.name} stock ${sign === "+" ? "increased" : "decreased"} by ${quantity}`, type: "success" });
            } catch (error) {
                setToast({ message: "Error changing quantity", type: "error" });
            } finally {
                setTimeout(() => {
                    setToast(null);
                }, 3000);
            }
        }
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
        <TableContainer
            title="Products"
            addButtonText="Add Product"
            onAddClick={() => redirect("/dashboard/products/add")}
            searchBar={
                <SearchBar
                    placeholder="Search products"
                    value={search}
                    onChange={handleSearchbarChange}
                />
            }
        >
            {showContextMenu && selectedProduct && (
                <ContextMenu
                    actions={[
                        {
                            label: "Increase stock", onClick: () => {
                                setNumberPopupMessage("Increase stock");
                                setNumberPopupSign("+");
                                setShowNumberPopup(true);
                            }
                        },
                        {
                            label: "Decrease stock", onClick: () => {
                                setNumberPopupMessage("Decrease stock");
                                setNumberPopupSign("-");
                                setShowNumberPopup(true);
                            }
                        },
                        {
                            label: "Edit", onClick: () => {
                                redirect(`/dashboard/products/edit/${selectedProduct.id}`)
                            }
                        },
                        {
                            label: "Delete", onClick: () => {
                                setShowConfirmDeletePopup(true);
                            }
                        }
                    ]}
                    coordinates={contextMenuPosition}
                />
            )}
            {toast && <BaseToast message={toast.message} type={toast.type} />}
            {showNumberPopup && <NumberPopup message={numberPopupMessage} onClose={() => setShowNumberPopup(false)} setNumber={setQuantity} onConfirm={() => handleChangeProductQuantity()} />}
            {showConfirmDeletePopup &&
                <PopupWindowContainer
                    title="Delete Product"
                    onClose={() => setShowConfirmDeletePopup(false)}
                    className="max-w-fit"
                >
                    <div className="flex flex-col gap-5">

                        <p className="pr-5">Are you sure you want to delete <span className="font-bold">{selectedProduct?.name}</span>?</p>
                        <div className="flex flex-row gap-5 justify-end">
                            <ClickableText onClick={() => setShowConfirmDeletePopup(false)} text="Cancel" />
                            <BaseButton onClick={() => {
                                handleDeleteProduct(selectedProduct.id);
                                setShowConfirmDeletePopup(false);
                            }}>Delete</BaseButton>
                        </div>
                    </div>
                </PopupWindowContainer>
            }
            <table className="w-full h-fit">
                <thead className="top-0">
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
                            onContextMenu={(e: React.MouseEvent<HTMLTableRowElement>) => handleProductsRowContextMenu(e, product)}
                        >
                            <td className="flex justify-center items-center py-2 px-1.5 cursor-pointer rounded-md opacity-0 group-hover:opacity-100 dark:group-hover:bg-backgroundTertiary-dark light:group-hover:bg-backgroundTertiary-light transition-opacity w-fit"
                                onClick={(e: React.MouseEvent<HTMLTableCellElement>) => handleProductsRowContextMenu(e, product)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="py-full h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="6" r="1" transform="rotate(-90 12 6)" />
                                    <circle cx="12" cy="12" r="1" transform="rotate(-90 12 12)" />
                                    <circle cx="12" cy="18" r="1" transform="rotate(-90 12 18)" />
                                </svg>
                            </td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{product.id}</td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-wrap break-all max-w-[25vw]">{product.name}</td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2">{product.unitPrice}</td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-wrap break-all max-w-[25vw]">{product.description}</td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2">{product.quantity}</td>
                            <td className="border border-line dark:border-line-dark border-line-light w-fit text-center px-2"><p className="text-sm bg-primary rounded-md m-2 px-2">{categories.find((category) => category.id === product.categoryId)?.name}</p></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableContainer>
    );
}