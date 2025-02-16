import AuthenticateFormButton from "../../buttons/AuthenticateFormButton";
import AuthenticateFormInput from "../../inputs/AuthenticateFormInput";
import PhoneNumberInput from "@/components/ui/inputs/PhoneNumberInput";

interface RegisterPersonalInformationFormProps {
    nextStep: (e: React.FormEvent<HTMLFormElement>) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setBirthDate: (birthDate: string) => void;
    error: string;
}

export default function RegisterPersonalInformationForm({ nextStep, setFirstName, setLastName, setPhoneNumber, setBirthDate, error }: RegisterPersonalInformationFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nextStep(e);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            nextStep(e);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                <div className="flex gap-4 max-md:flex-col">
                    <AuthenticateFormInput type="text" label="First Name" setValue={setFirstName} />
                    <AuthenticateFormInput type="text" label="Last Name" setValue={setLastName} />
                </div>
                <PhoneNumberInput setValue={setPhoneNumber} />
                <AuthenticateFormInput type="date" label="Birth Date" setValue={setBirthDate} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton type="submit" text="Next step" />
            </form>
        </div>
    );
}