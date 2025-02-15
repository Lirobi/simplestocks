"use client";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { updateUser } from "@/app/dashboard/business/actions";
import ClickableText from "@/components/ui/buttons/ClickableText";

export default function EditUserModal({
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="dark:bg-backgroundSecondary-dark bg-background-light rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit User</h2>
                    <button
                        onClick={onClose}
                        className="text-secondary-dark dark:text-secondary-light hover:text-primary"
                    >
                        ✕
                    </button>
                </div>

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

                    {['address', 'city', 'postalCode', 'country', 'phone', 'email'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label className="text-sm mb-1 capitalize">{field}</label>
                            <input
                                value={formData[field as keyof User] || ""}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                className="dark:bg-background-dark bg-background-light border border-line-light dark:border-line-dark rounded p-2"
                            />
                        </div>
                    ))}

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
                            className="px-4 py-2"
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
            </div>
        </div>
    );
} 