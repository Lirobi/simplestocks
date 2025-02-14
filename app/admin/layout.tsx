"use server";
import { getUser } from "../login/actions";
import { redirect } from "next/navigation";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    if (!user || (user.email !== "test@test.fr" && user.email !== "lilian.bischung@gmail.com")) { // TODO: change this to more secure way
        redirect("/login");
    }
    return (
        <div>
            {children}
        </div>
    )
}