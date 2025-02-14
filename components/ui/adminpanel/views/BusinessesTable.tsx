"use client";
import { useEffect, useState } from "react";
import { createBusiness, getBusinesses, updateBusiness, deleteBusiness } from "./actions";
import { Business } from "@prisma/client";
import BusinessForm from './BusinessForm';

export default function BusinessesTable() {
    const [businesses, setBusinesses] = useState([]);
    const [count, setCount] = useState(10);
    const [displayNewBusinessForm, setDisplayNewBusinessForm] = useState(false);
    const [displayEditBusinessForm, setDisplayEditBusinessForm] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const businesses = await getBusinesses();
            setBusinesses(businesses);
        }
        fetchBusinesses();
    }, []);

    const handleCountChange = (count: number) => {
        setCount(count);
        const fetchBusinesses = async () => {
            const businesses = await getBusinesses(count);
            setBusinesses(businesses);
        }
        fetchBusinesses();
    }

    const handleCreateNewBusiness = () => {
        setSelectedBusiness(null);
        setDisplayNewBusinessForm(!displayNewBusinessForm);
        setDisplayEditBusinessForm(false);
    }

    const handleEditBusiness = (business: Business) => {
        setSelectedBusiness(business);
        setDisplayEditBusinessForm(!displayEditBusinessForm);
        setDisplayNewBusinessForm(false);
    }

    const handleCreateNewBusinessSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const business = {
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            postalCode: formData.get("postalCode") as string,
            country: formData.get("country") as string,
            taxId: formData.get("taxId") as string,
            subscriptionPlan: formData.get("subscriptionPlan") as string,
            subscriptionStart: new Date(formData.get("subscriptionStart") as string),
            subscriptionEnd: new Date(formData.get("subscriptionEnd") as string),
        }
        const newBusiness = await createBusiness(business as Business);
        setBusinesses([...businesses, newBusiness]);
        setDisplayNewBusinessForm(false);
    }

    const handleEditBusinessSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const updatedBusiness = {
            ...selectedBusiness,
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            postalCode: formData.get("postalCode") as string,
            country: formData.get("country") as string,
            taxId: formData.get("taxId") as string,
            subscriptionPlan: formData.get("subscriptionPlan") as string,
            subscriptionStart: new Date(formData.get("subscriptionStart") as string),
            subscriptionEnd: new Date(formData.get("subscriptionEnd") as string),
        }
        const updated = await updateBusiness(updatedBusiness);
        setBusinesses(businesses.map(b => b.id === updated.id ? updated : b));
        setDisplayEditBusinessForm(false);
        setSelectedBusiness(null);
    }

    const handleDeleteBusiness = async () => {
        if (!selectedBusiness) return;
        try {
            await deleteBusiness(selectedBusiness.id);
            setBusinesses(businesses.filter(b => b.id !== selectedBusiness.id));
            setDisplayEditBusinessForm(false);
            setSelectedBusiness(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full items-center justify-center">
            <h1>Businesses Table</h1>
            <select onChange={(e) => {
                setCount(parseInt(e.target.value));
                handleCountChange(parseInt(e.target.value));
            }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
            <button onClick={handleCreateNewBusiness} className="border border-gray-500 p-1 text-sm bg-white rounded-sm ml-4">New business</button>

            {displayNewBusinessForm ? (
                <BusinessForm
                    onSubmit={handleCreateNewBusinessSubmit}
                    title="Create new business"
                />
            ) : displayEditBusinessForm && selectedBusiness ? (
                <BusinessForm
                    onSubmit={handleEditBusinessSubmit}
                    initialData={selectedBusiness}
                    onDelete={handleDeleteBusiness}
                    title="Edit business"
                />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th className=" w-fit px-2"></th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">ID</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Name</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Address</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">City</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Postal Code</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Country</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Tax ID</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Subscription Plan</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Subscription Start</th>
                            <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Subscription End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businesses.map((business) => (
                            <tr key={business.id}>
                                <td className="w-fit px-2 text-sm">
                                    <button
                                        onClick={() => handleEditBusiness(business)}
                                        className="border border-gray-500 p-1 text-sm bg-white rounded-sm"
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.id}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.name}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.address}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.city}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.postalCode}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.country}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.taxId}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.subscriptionPlan}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.subscriptionStart?.toString()}</td>
                                <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{business.subscriptionEnd?.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}