"use server";
import { getAdmins, addAdmin } from "@/lib/actions/user";
import { getUser } from "../login/actions";
import { redirect } from "next/navigation";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    if ((user.email === "test@test.fr" && process.env.NODE_ENV === "development") || user.email === "lilian.bischung@gmail.com") { // TODO: change this to more secure way
        const fetchAdmins = async () => {
            const admins = await getAdmins();
            if (!admins.some((admin) => admin.userId === user.id)) {
                await addAdmin(user.id);
            }
        }
        fetchAdmins();
    }
    const admins = await getAdmins();
    if (!user || !admins.some((admin) => admin.userId === user.id)) {
        redirect("/login");
    }
    return (
        <div>
            {children}
        </div>
    )
}