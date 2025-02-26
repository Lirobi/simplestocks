"use client"
import { redirect } from "next/navigation";
import { getUser, logoutUser } from "../login/actions";
import { createLog } from "@/lib/log/log";
export default function Logout() {
    const logout = async () => {
        const user = await getUser();
        await logoutUser();
        setTimeout(async () => {
            await createLog(user.id, 'LOGOUT', `User logged out`);
        }, 1000);
        redirect("/");
    }
    logout();
}
