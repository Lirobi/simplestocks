"use client";

import BaseToast from "./BaseToast";


export default function DisplayToast({ message, type }: { message: string, type: "success" | "error" }) {
    setTimeout(() => {
        return (
            <div>
                <BaseToast message={message} type={type} />
            </div>
        )
    }, 3000);
}