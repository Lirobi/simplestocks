"use client"
import BaseNumberInput from "../inputs/BaseNumberInput";
import ClickableText from "../buttons/ClickableText";
import BaseButton from "../buttons/BaseButton";
import { useState, useEffect } from "react";
import PopupWindowContainer from './PopupWindowContainer';

export default function NumberPopup({ message, allowNegative = false, onClose, setNumber, onConfirm }: { message: string, allowNegative?: boolean, onClose: () => void, setNumber: (quantity: number) => void, onConfirm: () => void }) {
    return (
        <PopupWindowContainer title={message} onClose={onClose} className="w-fit max-w-fit">
            <div className="space-y-4">
                <BaseNumberInput label="Quantity" name="quantity" className="w-full" onChange={(e) => setNumber(parseInt(e.target.value))} />



                <BaseButton className="py-4 w-full text-xl font-bold" onClick={onConfirm}>Confirm</BaseButton>
            </div>
        </PopupWindowContainer>
    );
}