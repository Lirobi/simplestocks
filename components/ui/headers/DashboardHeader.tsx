"use client";
import { User } from "@/lib/types/User";
import { getBusinessNameFromUserId } from "./actions";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAdmins } from "@/lib/actions/user";
import PopupWindowContainer from "../popups/PopupWindowContainer";
import BaseButton from "../buttons/BaseButton";
interface DashboardHeaderProps {
    user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [businessName, setBusinessName] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPreferencesUpcomingUpdatePopup, setShowPreferencesUpcomingUpdatePopup] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchBusinessName = async () => {
            const name = await getBusinessNameFromUserId(user.id.toString());
            setBusinessName(name);
        };
        fetchBusinessName();
        const fetchAdmins = async () => {
            const admins = await getAdmins();
            setIsAdmin(admins.some((admin) => admin.userId === user.id));
        }
        fetchAdmins();
    }, [user.id]);

    const handleLogout = async () => {
        redirect("/logout");
    };

    const handleSwitchTheme = () => {
        // Get current theme from cookie or system preference
        const currentTheme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        // Toggle to opposite theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Set cookie
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 year expiry

        // Toggle Tailwind theme
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    };



    const menuItems = [
        { label: "Tickets", onClick: () => router.push("/dashboard/tickets") },
        { label: "Settings (Coming Soon)", onclick: () => { setShowPreferencesUpcomingUpdatePopup(true) } }
        /* { label: "Switch Theme", onClick: () => handleSwitchTheme() },*/
    ];

    if (isAdmin) {
        menuItems.push({ label: "Admin Panel", onClick: () => router.push("/admin") });
    }

    return (
        <div className="flex justify-between items-center p-4 dark:bg-background-dark bg-background-light h-fit shadow-lg">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold dark:text-foreground-dark text-foreground-light cursor-pointer" onClick={() => redirect("/dashboard")}>Dashboard - {businessName}</h1>
            </div>
            <div className="relative " ref={menuRef}>
                <div className="flex items-center font-bold justify-center cursor-pointer dark:bg-backgroundSecondary-dark bg-backgroundSecondary-light text-foreground p-2 rounded-lg shadow-sm hover:scale-105 hover:bg-backgroundTertiary transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <h1 className="text-lg">{user?.firstName} {user?.lastName}</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mb-1 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>
                        <path d="M7 11l5-5 5 5" />
                        <path d="M7 17l5 5 5-5" />
                    </svg>
                </div>
                <div className={`absolute  right-0 mt-2 w-48 min-w-fit dark:bg-background-dark bg-background-light text-foreground rounded-lg shadow-lg py-2 transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={item.onClick}
                            className="text-nowrap px-4 py-2 dark:hover:bg-backgroundTertiary-dark hover:bg-backgroundTertiary-light cursor-pointer transition-all duration-300"
                        >
                            {item.label}
                        </div>
                    ))}
                    <div
                        onClick={handleLogout}
                        className="px-4 py-2 dark:hover:bg-backgroundTertiary-dark hover:bg-backgroundTertiary-light cursor-pointer text-primary transition-all border-t border-backgroundTertiary duration-300"
                    >
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
}