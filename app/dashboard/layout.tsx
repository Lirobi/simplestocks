import { redirect } from "next/navigation";
import { getUser } from "../login/actions";
import DashboardHeader from "@/components/ui/headers/DashboardHeader";
import DashboardSidebar from "@/components/ui/sidebars/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    return (
        <div className="flex flex-col w-screen h-screen overflow-x-hidden m-0 p-0 bg-backgroundSecondary overflow-y-hidden">
            <div className="z-50">
                <DashboardHeader user={user} />
            </div>
            <div className="flex h-full">
                <DashboardSidebar />
                {children}
            </div>
        </div>
    );
}