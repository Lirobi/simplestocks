"use client"
import { useEffect, useState } from "react"

export default function ProfilePictureWithInitials({ firstName = " ", lastName = " ", background = "primary", color = "white", className = "" }: { firstName: string, lastName: string, background?: string, color?: string, className?: string }) {
    const [firstNameStr, setFirstNameStr] = useState(firstName)
    const [lastNameStr, setLastNameStr] = useState(lastName)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setFirstNameStr(firstName)
        setLastNameStr(lastName)
        setIsLoading(false)
    }, [firstName, lastName])
    return (
        <div className={`bg-${background} rounded-full w-10 h-10 flex items-center justify-center ${className}`}>
            {isLoading ? <div className="w-full h-full animate-spin rounded-full border-t-2 border-b-2 border-primary"></div> : <p className={`text-${color} font-bold`}>{firstNameStr.charAt(0).toUpperCase() + lastNameStr.charAt(0).toUpperCase()}</p>}
        </div>
    )
}
