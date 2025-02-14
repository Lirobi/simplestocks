import { getInvite } from "@/lib/invites/invites";
import { redirect } from "next/navigation";
export default async function JoinPage({ params }: { params: { invite_url: string } }) {
    const invite = await getInvite(params.invite_url);
    if (!invite) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <svg
                className="h-40 w-40 text-primary mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Not found illustration"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 4" />
                <path d="M12 17h.01" />
            </svg>


            <h1 className="text-2xl font-bold">Invite not found</h1>
            <p className="text-sm text-gray-500">Please check the invite URL and try again.</p>
        </div>;
    } else {
        if (invite.uses >= invite.maxUses) {
            return <div className="flex flex-col items-center justify-center h-screen">


                <svg
                    className="h-40 w-40 text-primary mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Cross mark"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 8l8 8" />
                    <path d="M16 8l-8 8" />
                </svg>
                <h1 className="text-2xl font-bold">Invite expired</h1>
                <p className="text-sm text-gray-500">Please check the invite URL and try again.</p>
            </div>;

        } else {
            redirect("/register?invite_url=" + invite.url);
        }

    }
    return (
        <div>
            <h1>Join Page - {params.invite_url}</h1>
        </div>
    );
}