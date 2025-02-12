export default function RegisterFormsContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded-md justify-center items-center max-md:scale-110 scale-150 w-fit min-h-1/2 h-fit">
            {children}
        </div>
    );
}