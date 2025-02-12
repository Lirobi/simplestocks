export default function BaseToast({ message, type }: { message: string, type: "success" | "error" }) {
    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
            <div className={`border border-line-light dark:border-line-dark rounded-lg p-4 shadow-lg ${type === "success" ? "bg-green-400" : "bg-primary"} animate-[fade-in_0.3s_ease-out]`}>
                <h1 className="text-lg font-bold">{message}</h1>
            </div>
        </div>
    );
}