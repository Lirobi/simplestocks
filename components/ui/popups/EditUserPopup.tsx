"use client";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { updateUser } from "@/app/dashboard/business/actions";
import ClickableText from "@/components/ui/buttons/ClickableText";
import PopupWindowContainer from './PopupWindowContainer';

export default function EditUserPopup({
    user,
    onClose,
    onSave
}: {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}) {
    const [formData, setFormData] = useState<Partial<User>>(user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await updateUser(user.id, formData as User);
        if (result.success) {
            onSave(result.user);
            onClose();
        } else {
            setError(result.error || "Failed to update user");
        }
        setLoading(false);
    };

    return (
        <PopupWindowContainer title={`Edit User Details - ${user.firstName} ${user.lastName}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm mb-1">First Name</label>
                        <input
                            value={formData.firstName || ""}
                            disabled
                            className="dark:bg-backgroundSecondary-dark bg-backgroundSecondary-light border border-line-light dark:border-line-dark rounded p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Last Name</label>
                        <input
                            value={formData.lastName || ""}
                            disabled
                            className="dark:bg-backgroundSecondary-dark bg-backgroundSecondary-light border border-line-light dark:border-line-dark rounded p-2"
                        />
                    </div>
                </div>

                {['phone', 'email', 'address'].map((field) => (
                    <div key={field} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{field}</label>
                        <input
                            value={String(formData[field as keyof User] || "")}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className="dark:bg-background-dark bg-background-light border border-line-light dark:border-line-dark rounded p-2"
                        />
                    </div>
                ))}

                {/* New grid for city/postal/country */}
                <div className="grid grid-cols-3 gap-4">
                    {['postalCode', 'city', 'country'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label className="text-sm mb-1 capitalize">{field}</label>
                            <input
                                value={String(formData[field as keyof User] || "")}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                className="dark:bg-background-dark bg-background-light border border-line-light dark:border-line-dark rounded p-2"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm mb-1">Role</label>
                    <select
                        value={formData.role || ""}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="dark:bg-background-dark bg-background-light border border-line-light dark:border-line-dark rounded p-2"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-2 mt-6">
                    <ClickableText
                        text="Cancel"
                        onClick={onClose}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </PopupWindowContainer>
    );
} 