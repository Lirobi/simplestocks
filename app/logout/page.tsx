"use client"
import { redirect } from "next/navigation";
import { deleteToken } from "../login/actions";

export default function Logout() {
    const logout = async () => {
        await deleteToken();
        redirect("/login");
    }
    logout();
}
