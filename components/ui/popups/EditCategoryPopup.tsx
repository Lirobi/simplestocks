import { Category } from "@prisma/client";
import BaseFormInput from "../inputs/BaseFormInput";
import BaseButton from "../buttons/BaseButton";
import PopupWindowContainer from "./PopupWindowContainer";
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
        <PopupWindowContainer onClose={onClose} title={`${action} Category - ${name || "New Category"}`} className="w-fit max-w-fit">

            <BaseFormInput label="Name" name="name" value={name} className="" onChange={(e) => setName(e.target.value)} />
            <BaseFormInput label="Description" name="description" value={description} className="" onChange={(e) => setDescription(e.target.value)} />
            <BaseButton onClick={onConfirm} className="w-full">Save</BaseButton>
        </PopupWindowContainer>
    )
}