"use client";
import BusinessesTable from "@/components/ui/adminpanel/views/BusinessesTable";
import UsersTable from "@/components/ui/adminpanel/views/UsersTable";
import { useState } from "react";
import { redirect } from "next/navigation";
import LogsTable from "@/components/ui/adminpanel/views/LogsTable";
import ManageApp from "@/components/ui/adminpanel/views/ManageApp";
import { useRouter } from "next/navigation";
import TicketsPage from "@/app/dashboard/tickets/page";
import Articles from "@/components/ui/adminpanel/views/Articles";
export default function AdminPage() {
    const router = useRouter();
    const [displayedView, setDisplayedView] = useState(-1);
    return (
        <div className="flex flex-col gap-4 items-center justify-center ">
            <button className="absolute top-0 left-0 text-blue-600 p-1" onClick={() => router.push("/dashboard")}>&#60; <u>Back to Dashboard</u></button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>

            <div className="flex gap-4 z-50 border-b justify-center border-black w-full shadow-md">
                <button className={`${displayedView === -1 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(-1)}>Manage App</button>
                <button className={`${displayedView === 0 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(0)}>Users</button>
                <button className={`${displayedView === 1 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(1)}>Businesses</button>
                <button className={`${displayedView === 2 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(2)}>Logs</button>
                <button className={`${displayedView === 3 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(3)}>Tickets</button>
                <button className={`${displayedView === 4 ? "underline" : ""} p-2 rounded-md`} onClick={() => setDisplayedView(4)}>Articles</button>
            </div>
            {displayedView === -1 && <ManageApp />}
            {displayedView === 0 && <UsersTable />}
            {displayedView === 1 && <BusinessesTable />}
            {displayedView === 2 && <LogsTable />}
            {displayedView === 3 && <TicketsPage />}
            {displayedView === 4 && <Articles />}
        </div>
    )
}