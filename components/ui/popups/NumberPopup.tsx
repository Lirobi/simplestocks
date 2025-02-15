"use client"
import BaseNumberInput from "../inputs/BaseNumberInput";
import BaseButton from "../buttons/BaseButton";
import { useState, useEffect } from "react";
import PopupWindowContainer from './PopupWindowContainer';

export default function NumberPopup({ message, allowNegative = false, onClose, setNumber, onConfirm }: { message: string, allowNegative?: boolean, onClose: () => void, setNumber: (quantity: number) => void, onConfirm: () => void }) {
    return (
        <PopupWindowContainer title="Phone Number Verification" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-gray-600">We've sent a verification code to your phone number</p>
                <BaseNumberInput label="Quantity" name="quantity" className="max-w-fit" onChange={(e) => setNumber(parseInt(e.target.value))} />
                <BaseButton className="w-full py-4 text-xl font-bold" onClick={onConfirm}>Confirm</BaseButton>
            </div>
        </PopupWindowContainer>
    );
}