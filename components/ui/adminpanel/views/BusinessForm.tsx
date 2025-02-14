import { Business } from "@prisma/client";

interface BusinessFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    initialData?: Business;
    onDelete?: () => Promise<void>;
    title: string;
}

export default function BusinessForm({ onSubmit, initialData, onDelete, title }: BusinessFormProps) {
    return (
        <div className="flex flex-col gap-2 w-2/3 items-center justify-center">
            <h1 className="text-xl font-bold">{title}</h1>
            <form onSubmit={onSubmit} className="flex flex-wrap gap-2 items-center justify-normal">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Name" name="name" defaultValue={initialData?.name} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="address">Address</label>
                    <input type="text" placeholder="Address" name="address" defaultValue={initialData?.address} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="city">City</label>
                    <input type="text" placeholder="City" name="city" defaultValue={initialData?.city} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input type="text" placeholder="Postal Code" name="postalCode" defaultValue={initialData?.postalCode} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="country">Country</label>
                    <input type="text" placeholder="Country" name="country" defaultValue={initialData?.country} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="taxId">Tax ID</label>
                    <input type="text" placeholder="Tax ID" name="taxId" defaultValue={initialData?.taxId} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="subscriptionPlan">Subscription Plan</label>
                    <select name="subscriptionPlan" id="subscriptionPlan" defaultValue={initialData?.subscriptionPlan}>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="subscriptionStart">Subscription Start</label>
                    <input
                        type="date"
                        name="subscriptionStart"
                        id="subscriptionStart"
                        defaultValue={initialData?.subscriptionStart?.toISOString().split('T')[0]}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="subscriptionEnd">Subscription End</label>
                    <input
                        type="date"
                        name="subscriptionEnd"
                        id="subscriptionEnd"
                        defaultValue={initialData?.subscriptionEnd?.toISOString().split('T')[0]}
                    />
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                    <button type="submit" className="self-end border border-gray-500 p-1 w-full text-sm bg-white rounded-sm">
                        {initialData ? 'Update' : 'Create'}
                    </button>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="self-end border border-red-500 p-1 w-full text-sm bg-white text-red-500 rounded-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
} 