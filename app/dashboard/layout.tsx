"use server"
import { redirect } from "next/navigation";
import { getUser } from "../login/actions";
import DashboardHeader from "@/components/ui/headers/DashboardHeader";
import DashboardSidebar from "@/components/ui/sidebars/DashboardSidebar";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    try {
        const appStatus = await prisma.appStatus.findUnique({
            where: {
                id: 1
            }
        });

        if (!appStatus) {
            const appStatus = await prisma.appStatus.create({
                data: {
                    status: "Active"
                }
            });
        }

        if (appStatus?.status === "Maintenance") {
            return (
                <div className="flex flex-col w-screen h-screen overflow-x-hidden m-0 p-0 bg-backgroundSecondary overflow-y-hidden">
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.735-.14a1.125 1.125 0 006.218 6.218 5.5 5.5 0 01-.14 1.735 5.502 5.502 0 01-.32.385l-.527.526M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-primary">Maintenance in Progress</h2>
                        <p className="text-foreground-light dark:text-foreground-dark max-w-md">
                            We're currently performing scheduled maintenance. Please check back later. Thank you for your patience.
                        </p>
                    </div>

                </div>
            );
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="flex flex-col w-screen h-screen overflow-x-hidden m-0 p-0 bg-backgroundSecondary overflow-y-hidden">
            <div className="z-50">
                <DashboardHeader user={user} />
            </div>
            <div className="flex h-full">
                <DashboardSidebar defaultOpen={true as boolean} />
                {children}
            </div>
        </div>
    );
}