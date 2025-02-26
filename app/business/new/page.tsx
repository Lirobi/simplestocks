"use client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
import { useEffect, useState } from "react";
import { getUser, loginUser, forceLoginTemp } from "@/app/login/actions"
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createBusiness } from "./actions";


export default function NewBusinessPage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        const user = await getUser();
        if (user) {
            setUser(user as unknown as User);
        } else {
            router.push("/login");
        }

    }
    useEffect(() => {
        fetchUser();
    }, []);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    const handleCreateBusiness = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await createBusiness({
                name,
                address,
                city,
                postalCode,
                country
            });

            if (result.success) {
                router.push("/dashboard");
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">New Business</h1>
            <form onSubmit={handleCreateBusiness} className="flex flex-col gap-4">
                <BaseFormInput label="Name" onChange={(e) => setName(e.target.value)} />
                <BaseFormInput label="Address" onChange={(e) => setAddress(e.target.value)} />
                <div className="flex gap-2">
                    <BaseFormInput label="City" onChange={(e) => setCity(e.target.value)} />
                    <BaseFormInput label="Postal Code" onChange={(e) => setPostalCode(e.target.value)} />
                    <BaseFormInput label="Country" onChange={(e) => setCountry(e.target.value)} />
                </div>
                <BaseButton type="submit">Create</BaseButton>
            </form>
        </div>
    )
}