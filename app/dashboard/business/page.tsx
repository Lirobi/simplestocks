"use client";
import ClickableText from "@/components/ui/buttons/ClickableText";
import { useState, useEffect } from "react";
import { getBusinessFromId, getUsersFromBusinessId } from "./actions";
import { Business, User } from "@prisma/client";
import { getUser } from "@/app/login/actions";
import EditUserModal from "@/components/ui/adminpanel/views/EditUserModal";
import { updateUser } from "./actions";
import BaseButton from "@/components/ui/buttons/BaseButton";
import BaseNumberInput from "@/components/ui/inputs/BaseNumberInput";
import { createInvite } from "@/lib/invites/invites";
import BaseToast from "@/components/ui/toasts/BaseToast";
export default function BusinessPage() {


    const [displayedView, setDisplayedView] = useState(0);
    const [business, setBusiness] = useState<Business | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [generateInviteLinkPopup, setGenerateInviteLinkPopup] = useState(false);

    const [maxUses, setMaxUses] = useState(1);

    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

    useEffect(() => {
        const fetchData = async () => {

            const user = await getUser();
            const business = await getBusinessFromId(user.businessId);
            const users = await getUsersFromBusinessId(user.businessId);
            setBusiness(business);
            setUsers(users);
        }
        fetchData();
    }, []);

    const handleSaveUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleGenerateInviteLink = async () => {
        const invite = await createInvite(business.id, maxUses);
        setToast({ message: "Invite link generated : https://" + (process.env.NEXT_PUBLIC_URL || "localhost:3000") + "/join/" + invite.url, type: "success" });
        navigator.clipboard.writeText("https://" + (process.env.NEXT_PUBLIC_URL || "localhost:3000") + "/join/" + invite.url);
        setTimeout(() => {
            setToast(null);
        }, 10000);
    }


    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">Employees</h1>
                <BaseButton onClick={() => setGenerateInviteLinkPopup(!generateInviteLinkPopup)}>Generate Invite Link</BaseButton>
            </div>
            {toast && (
                <BaseToast message={toast.message} type={toast.type} />
            )}
            {generateInviteLinkPopup && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit p-10 bg-background-light shadow-md dark:bg-background-dark rounded-lg z-50">
                    <div className="flex pb-2 gap-4 justify-between">
                        <h1 className="text-2xl font-bold">Generate Invite Link</h1>
                        <button onClick={() => setGenerateInviteLinkPopup(false)} className="text-foreground-light dark:text-foreground-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <BaseNumberInput label="Max Uses" value={maxUses} onChange={(e) => setMaxUses(e.target.valueAsNumber)} />
                    <BaseButton onClick={handleGenerateInviteLink} className="w-full">Generate</BaseButton>
                </div>
            )}
            {displayedView === 0 && (
                <div className="w-full px-10">
                    <table className="w-full h-fit">
                        <thead className="top-0 ">
                            <tr>
                                <th className="w-fit p-2 cursor-pointer"></th>
                                <th className="w-fit p-2 cursor-pointer">Name</th>
                                <th className="w-fit p-2 cursor-pointer">Address</th>
                                <th className="w-fit p-2 cursor-pointer">City</th>
                                <th className="w-fit p-2 cursor-pointer">Postal Code</th>
                                <th className="w-fit p-2 cursor-pointer">Country</th>
                                <th className="w-fit p-2 cursor-pointer">Phone</th>
                                <th className="w-fit p-2 cursor-pointer">Email</th>
                                <th className="w-fit p-2 cursor-pointer">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="group">
                                    <td className=" w-fit p-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowEditModal(true);
                                            }}
                                            className=""
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-9 w-9 p-1.5 text-foreground-light dark:text-foreground-dark opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer dark:group-hover:bg-background-dark light:group-hover:bg-backgroundTertiary-light rounded-md"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5l4 4-9 9H12v-4.5l9-9z" />
                                                <path d="M3 21v-3.5L15.5 4l3.5 3.5L7.5 21H3z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.firstName} {user.lastName}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.address}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.city}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.postalCode}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.country}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.phone}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.email}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2">{user.role}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
            {displayedView === 1 && (
                <div>

                </div>
            )}
            {
                showEditModal && selectedUser && (
                    <EditUserModal
                        user={selectedUser}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleSaveUser}
                    />
                )
            }
        </div >
    )
}