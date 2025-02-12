"use client"
import { redirect } from "next/navigation";
import { logoutUser } from "../login/actions";

export default function Logout() {
    const logout = async () => {
        await logoutUser();
        redirect("/login");
    }
    logout();
}
