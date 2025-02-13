import { Category } from "@prisma/client";
import BaseFormInput from "../inputs/BaseFormInput";
import BaseButton from "../buttons/BaseButton";
interface EditCategoryPopupProps {
    action: "Add" | "Edit";
    name: string;
    description: string;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

export default function EditCategoryPopup({ action, name, description, setName, setDescription, onClose, onConfirm }: EditCategoryPopupProps) {
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit flex flex-col overflow-auto rounded-md shadow-md z-50 p-10 dark:bg-background-dark bg-background-light">
            <div className="flex justify-between items-center">
                <h1>{action} Category - {name || "New Category"}</h1>
                <button onClick={onClose} className="hover:bg-backgroundSecondary-light dark:hover:bg-backgroundTertiary-dark rounded-md ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <BaseFormInput label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            <BaseFormInput label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <BaseButton onClick={onConfirm}>Save</BaseButton>
        </div>
    )
}