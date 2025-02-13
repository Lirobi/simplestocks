import BaseNumberInput from "../inputs/BaseNumberInput";
import BaseButton from "../buttons/BaseButton";


export default function NumberPopup({ message, onClose, setNumber, onConfirm }: { message: string, onClose: () => void, setNumber: (quantity: number) => void, onConfirm: () => void }) {
    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 bg-background-light dark:bg-background-dark">
            <div className="border border-line-light dark:border-line-dark rounded-lg p-4 shadow-lg">
                <div className="flex justify-between">
                    <h1 className="text-lg font-bold">{message}</h1>
                    <button onClick={onClose} className="text-foreground-light dark:text-foreground-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <BaseNumberInput label="Quantity" name="quantity" className="max-w-fit" onChange={(e) => setNumber(parseInt(e.target.value))} />
                <BaseButton className="w-full py-4 text-xl font-bold" onClick={onConfirm}>Confirm</BaseButton>
            </div>
        </div>
    );
}