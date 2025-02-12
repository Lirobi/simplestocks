import BaseNumberInput from "../inputs/BaseNumberInput";
import BaseButton from "../buttons/BaseButton";


export default function NumberPopup({ message, setNumber, onConfirm }: { message: string, setNumber: (quantity: number) => void, onConfirm: () => void }) {
    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 bg-background-light dark:bg-background-dark">
            <div className="border border-line-light dark:border-line-dark rounded-lg p-4 shadow-lg">
                <h1 className="text-lg font-bold">{message}</h1>
                <BaseNumberInput label="Quantity" name="quantity" className="max-w-fit" onChange={(e) => setNumber(parseInt(e.target.value))} />
                <BaseButton className="w-full py-4 text-xl font-bold" onClick={onConfirm}>Confirm</BaseButton>
            </div>
        </div>
    );
}