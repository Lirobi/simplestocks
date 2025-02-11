import AuthenticateFormButton from "../../buttons/AuthenticateFormButton";
import AuthenticateFormInput from "../../inputs/AuthenticateFormInput";

interface RegisterPersonalInformationFormProps {
    nextStep: (e: React.FormEvent<HTMLFormElement>) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setBirthDate: (birthDate: string) => void;
    error: string;
}

export default function RegisterPersonalInformationForm({ nextStep, setFirstName, setLastName, setPhoneNumber, setBirthDate, error }: RegisterPersonalInformationFormProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <form className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <AuthenticateFormInput type="text" label="First Name" setValue={setFirstName} />
                    <AuthenticateFormInput type="text" label="Last Name" setValue={setLastName} />
                </div>
                <AuthenticateFormInput type="text" label="Phone" setValue={setPhoneNumber} />
                <AuthenticateFormInput type="date" label="Birth Date" setValue={setBirthDate} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton onSubmit={nextStep} text="Next step" />
            </form>
        </div>
    );
}