import { redirect } from "next/navigation";
import { getUser } from "../login/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    return (
        <div>
            {children}
        </div>
    );
}