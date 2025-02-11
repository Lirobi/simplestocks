import AuthenticateFormInput from "../../inputs/AuthenticateFormInput";
import AuthenticateFormButton from "../../buttons/AuthenticateFormButton";

interface RegisterAdditionalInformationFormProps {
    nextStep: (e: React.FormEvent<HTMLFormElement>) => void;
    setAddress: (address: string) => void;
    setCity: (city: string) => void;
    setPostalCode: (postalCode: string) => void;
    setCountry: (country: string) => void;
    error: string;
}

export default function RegisterAdditionalInformationForm({ nextStep, setAddress, setCity, setPostalCode, setCountry, error }: RegisterAdditionalInformationFormProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <form className="flex flex-col gap-4">
                <AuthenticateFormInput type="text" label="Address" setValue={setAddress} />
                <div className="flex gap-4">
                    <AuthenticateFormInput type="text" label="City" setValue={setCity} />
                    <AuthenticateFormInput type="text" label="Postal Code" setValue={setPostalCode} />
                </div>
                <AuthenticateFormInput type="text" label="Country" setValue={setCountry} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton onSubmit={nextStep} text="Register" />
            </form>
        </div>
    );
}