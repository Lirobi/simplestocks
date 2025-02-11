
import AuthenticateFormButton from "../../buttons/AuthenticateFormButton";
import AuthenticateFormInput from "../../inputs/AuthenticateFormInput";

interface RegisterCredentialsFormProps {
    nextStep: (e: React.FormEvent<HTMLFormElement>) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    error: string;
}

export default function RegisterCredentialsForm({ nextStep, setEmail, setPassword, setConfirmPassword, error }: RegisterCredentialsFormProps) {

    return (
        <div>
            <h1 className="text-2xl font-bold">Credentials</h1>
            <form className="flex flex-col gap-4">
                <AuthenticateFormInput type="email" label="Email" setValue={setEmail} />
                <AuthenticateFormInput type="password" label="Password" setValue={setPassword} />
                <AuthenticateFormInput type="password" label="Confirm Password" setValue={setConfirmPassword} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton onSubmit={nextStep} text="Next step" />
            </form>
        </div>
    );
}