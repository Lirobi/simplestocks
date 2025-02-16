
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
            <h1 className="text-2xl font-bold">Credentials</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                <AuthenticateFormInput type="email" label="Email" setValue={setEmail} />
                <AuthenticateFormInput type="password" label="Password" setValue={setPassword} />
                <AuthenticateFormInput type="password" label="Confirm Password" setValue={setConfirmPassword} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton type="submit" text="Next step" />
            </form>
        </div>
    );
}