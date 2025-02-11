export default function RegisterFormsContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-md justify-center items-center scale-150 w-fit min-h-1/2 h-fit">
            {children}
        </div>
    );
}