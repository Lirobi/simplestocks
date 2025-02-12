"use client"
import RegisterCredentialsForm from "@/components/ui/forms/registerforms/RegisterCredentialsForm";
import RegisterPersonalInformationForm from "@/components/ui/forms/registerforms/RegisterPersonalInformationForm";
import RegisterAdditionalInformationForm from "@/components/ui/forms/registerforms/RegisterAdditionalInformationForm";
import { useState } from "react";
import RegisterFormsContainer from "@/components/ui/forms/registerforms/RegisterFormsContainer";
import { checkIfEmailAlreadyUsed, registerUser } from "./actions";
import { useRouter } from "next/navigation";


export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [error, setError] = useState("");

    const nextStep = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 0) {
            if (email && password && confirmPassword) {
                const emailAlreadyUsed = await checkIfEmailAlreadyUsed(email);
                if (emailAlreadyUsed) {
                    setError("Registration failed. Please check your details.");
                    return;
                }
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                } else if (password.length < 8) {
                    setError("Password must be at least 8 characters long");
                    return;
                } else {
                    let numbersCount = 0;
                    let uppercaseCount = 0;
                    let lowercaseCount = 0;
                    let specialCharactersCount = 0;
                    for (const char of password) {
                        if (/[0-9]/.test(char)) {
                            numbersCount++;
                        }
                        if (/[A-Z]/.test(char)) {
                            uppercaseCount++;
                        }
                        if (/[a-z]/.test(char)) {
                            lowercaseCount++;
                        }
                        if (/[^0-9A-Za-z]/.test(char)) {
                            specialCharactersCount++;
                        }
                    }

                    if (numbersCount < 1 || uppercaseCount < 1 || lowercaseCount < 1 || specialCharactersCount < 1) {
                        setError("Password is not safe");
                        return;
                    }
                }
            } else {
                setError("Please fill in all fields");
                return;
            }
        } else if (step === 1) {
            if (firstName && lastName && phoneNumber && birthDate) {
                if (phoneNumber.length !== 10) {
                    setError("Phone number must be 10 digits");
                    return;

                }
            } else {
                setError("Please fill in all fields");
                return;
            }
        } else if (step === 2) {
            if (address && city && postalCode && country) {
                try {
                    registerUser({
                        email,
                        password,
                        firstName,
                        lastName,
                        phoneNumber,
                        birthDate,
                        address,
                        city,
                        postalCode,
                        country
                    });
                    router.push('/login'); // Redirect to login after successful registration
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Registration failed");
                    return;
                }
            } else {
                setError("Please fill in all fields");
                return;
            }
        }

        setError("");
        setStep(step + 1);
    }

    return (
        <div className="flex justify-center items-center h-screen overflow-hidden">
            <div className="status-bar px-4 absolute top-[5vh] rounded-md w-fit h-10 bg-background-light dark:bg-background-dark flex justify-center items-center font-bold max-md:hidden">
                <div className="flex gap-4">
                    <p className={step >= 0 ? "text-primary cursor-pointer" : ""} onClick={() => step >= 0 && setStep(0)} >Credentials</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-2"><path d="M12 5l7 7-7 7" /></svg>
                    <p className={step >= 1 ? "text-primary cursor-pointer" : ""} onClick={() => step >= 1 && setStep(1)}>Personal Information</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-2"><path d="M12 5l7 7-7 7" /></svg>
                    <p className={step >= 2 ? "text-primary cursor-pointer" : ""} onClick={() => step >= 2 && setStep(2)}>Additional Information</p>
                </div>
            </div>
            <div className="flex gap-4 transition-all duration-500 ease-in-out" style={{ transform: `translateX(-${step * 100}%)` }}>
                <div className="flex-shrink-0 w-full">
                    {step === 0 &&
                        <RegisterFormsContainer>
                            <RegisterCredentialsForm nextStep={nextStep} setEmail={setEmail} setPassword={setPassword} setConfirmPassword={setConfirmPassword} error={error} />
                        </RegisterFormsContainer>
                    }
                </div>
                <div className="flex-shrink-0 w-full">
                    {step === 1 &&
                        <RegisterFormsContainer>
                            <RegisterPersonalInformationForm nextStep={nextStep} setFirstName={setFirstName} setLastName={setLastName} setPhoneNumber={setPhoneNumber} setBirthDate={setBirthDate} error={error} />
                        </RegisterFormsContainer>
                    }
                </div>
                <div className="flex-shrink-0 w-full">
                    {step === 2 &&
                        <RegisterFormsContainer>
                            <RegisterAdditionalInformationForm nextStep={nextStep} setAddress={setAddress} setCity={setCity} setPostalCode={setPostalCode} setCountry={setCountry} error={error} />
                        </RegisterFormsContainer>
                    }
                </div>
            </div>
        </div >
    );
}