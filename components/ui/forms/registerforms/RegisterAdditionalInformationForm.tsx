import AuthenticateFormInput from "../../inputs/AuthenticateFormInput";
import AuthenticateFormButton from "../../buttons/AuthenticateFormButton";
import PostalCodeInput from "../../inputs/PostalCodeInput";

interface RegisterAdditionalInformationFormProps {
    nextStep: (e: React.FormEvent<HTMLFormElement>) => void;
    setAddress: (address: string) => void;
    setCity: (city: string) => void;
    setPostalCode: (postalCode: string) => void;
    setCountry: (country: string) => void;
    error: string;
}

export default function RegisterAdditionalInformationForm({ nextStep, setAddress, setCity, setPostalCode, setCountry, error }: RegisterAdditionalInformationFormProps) {
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
            <h1 className="text-2xl font-bold">Additional Information</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                <AuthenticateFormInput type="text" label="Address" setValue={setAddress} />
                <div className="flex gap-4 max-md:flex-col">
                    <PostalCodeInput setValue={setPostalCode} />
                    <AuthenticateFormInput type="text" label="City" setValue={setCity} />
                </div>
                <AuthenticateFormInput type="text" label="Country" setValue={setCountry} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton type="submit" text="Register" />
            </form>
        </div>
    );
}