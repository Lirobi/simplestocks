"use client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import ClickableText from "@/components/ui/buttons/ClickableText";
import TableContainer from "@/components/ui/containers/TableContainer";
import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
import BaseTextArea from "@/components/ui/inputs/BaseTextArea";
import PopupWindowContainer from "@/components/ui/popups/PopupWindowContainer";
import { useState, useEffect, useRef } from "react";
import { createTicket, getTicket, getTickets, updateTicket } from "@/lib/actions/tickets";
import { getAdmins, getAdminsIds, getUser } from "@/lib/actions/user";
import { User } from "@/lib/types/User";
import { Ticket, TicketMessage, Admins } from "@prisma/client";
import { getTicketsByUserId, getTicketMessages, createTicketMessage } from "@/lib/actions/tickets";
import { redirect, useSearchParams } from "next/navigation";
import { createLog } from "@/lib/log/log";

function TicketPopup({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    const handleCreateTicket = async () => {
        if (title.length === 0) {
            setError("Title is required");
            setTimeout(() => setError(""), 3000);
            return;
        } else if (title.length > 50) {
            setError("Title must be less than 50 characters");
            setTimeout(() => setError(""), 3000);
            return;
        }
        if (description.length === 0) {
            setError("Description is required");
            setTimeout(() => setError(""), 3000);
            return;
        } else if (description.length > 1000) {
            setError("Description must be less than 1000 characters");
            setTimeout(() => setError(""), 3000);
            return;
        }
        await createTicket(title, description, user?.id);
        await createLog(user?.id || 0, "Ticket Created", `Ticket "${title}" created by ${user?.email}`);
        onClose();
        window.location.reload();
    }
    return (
        <PopupWindowContainer title="New Ticket" onClose={onClose}>
            <BaseFormInput label="Title" onChange={(e) => setTitle(e.target.value)} />
            <BaseTextArea label="Tell us more about the issue" onChange={(e) => setDescription(e.target.value)} />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
                <ClickableText onClick={onClose} text="Cancel" />
                <BaseButton onClick={handleCreateTicket}>Create</BaseButton>
            </div>
        </PopupWindowContainer>
    )
}




function TicketList({ handleClickTicket }: { handleClickTicket: (ticket: Ticket) => void }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [order, setOrder] = useState<"date" | "status">("date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    useEffect(() => {
        const fetchData = async () => {
            const user = await getUser();
            setUser(user);
            if (user.email === "test@test.fr" || user.email === "lilian.bischung@gmail.com") {
                const tickets = await getTickets();
                setTickets(tickets);
            } else {
                const tickets = await getTicketsByUserId(user?.id);
                setTickets(tickets);
            }
        }
        fetchData();
    }, []);


    return (
        <div className="flex flex-col gap-2 p-4">
            <table className="w-full">
                <thead className="w-full">
                    <tr className="w-full">
                        <th className="text-center w-fit">Ticket ID</th>
                        <th className="text-center w-fit">Title</th>
                        <th className="text-center w-fit cursor-pointer" onClick={() => (setOrder("status"), setSortDirection(sortDirection === "asc" ? "desc" : "asc"))}>Status {sortDirection && order === "status" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
                        <th className="text-center w-fit cursor-pointer" onClick={() => (setOrder("date"), setSortDirection(sortDirection === "asc" ? "desc" : "asc"))}>Updated At {sortDirection && order === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
                        <th className="text-center w-fit">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.sort((a, b) => order === "date" ? (sortDirection === "asc" ? b.updatedAt.getTime() - a.updatedAt.getTime() : a.updatedAt.getTime() - b.updatedAt.getTime()) : (sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status))).map((ticket) => (
                        <tr key={ticket.id} className=" shadow-md border border-gray-200 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300" onClick={() => handleClickTicket(ticket)}>
                            <td className="w-fit text-center p-2">{ticket.id}</td>
                            <td className="w-fit text-center p-2">{ticket.title}</td>
                            <td className="w-full flex justify-center items-center p-2">
                                <p className={`w-fit px-10 p-0.5 rounded-md ${ticket.status.toLowerCase() === "open" ? "bg-green-500" : ticket.status.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`}>{ticket.status}</p>
                            </td>
                            <td className="w-fit text-center p-2">{ticket.updatedAt.toLocaleString()}</td>
                            <td className="w-fit text-center p-2">{ticket.createdAt.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

interface TicketMessageWithUser extends TicketMessage {
    user: User;
}

function TicketDetails({ ticket, onClose }: { ticket: Ticket, onClose: () => void }) {
    const [status, setStatus] = useState(ticket.status);
    const [messages, setMessages] = useState<TicketMessageWithUser[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [messageTimestamps, setMessageTimestamps] = useState<Date[]>([]);
    const [cooldownActive, setCooldownActive] = useState(false);
    const [lastMessage, setLastMessage] = useState<TicketMessageWithUser | null>(null);
    const [ticketOwner, setTicketOwner] = useState<User | null>(null);
    const [lineClampDesc, setLineClampDesc] = useState<boolean>(true);

    // Add a ref for the messages container
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();

        const fetchTicketOwner = async () => {
            const ticketOwner = await getUser(ticket.userId.toString());
            setTicketOwner(ticketOwner);
        }
        fetchTicketOwner();
    }, []);

    // Function to fetch messages
    const fetchMessages = async (count: number = 1000, skip: number = 0) => {
        let fetchedUsers: User[] = [];
        const fetchedMessages = await getTicketMessages(ticket.id, count, skip);
        const messagesWithUser: TicketMessageWithUser[] = [];

        for (const message of fetchedMessages) {
            if (!fetchedUsers.some(user => user.id === message.userId)) {
                const user = await getUser(message.userId.toString());
                fetchedUsers.push(user);
                messagesWithUser.push({ ...message, user });
            } else {
                const user = fetchedUsers.find(user => user.id === message.userId);
                messagesWithUser.push({ ...message, user });
            }

            // Update the last message ID
            if (message.createdAt > lastMessage?.createdAt) {
                setLastMessage(messagesWithUser[messagesWithUser.length - 1]);
            }
        }

        setMessages(messagesWithUser);
    };

    useEffect(() => {
        // Initial fetch
        fetchMessages(3); // Only fetch 6 messages initially for performance

        setTimeout(() => { // Fetch all messages after 2 seconds
            fetchMessages(12);
        }, 1000);
        setTimeout(() => { // Fetch all messages after 2 seconds
            fetchMessages(30);
        }, 2000);
        // Set up polling for new messages every 3 seconds
        const intervalId = setInterval(async () => {
            const newMessages = await getTicketMessages(ticket.id, 1, 0);

            // Check if there are new messages
            const hasNewMessages = newMessages.some(msg => msg.createdAt > lastMessage?.createdAt);

            if (hasNewMessages) {
                fetchMessages(1000);
                // Scroll to bottom when new messages arrive
                setTimeout(scrollToBottom, 100);
            }
        }, 3000);

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [ticket.id, lastMessage?.createdAt]);

    // Add effect to scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const handleSendMessage = async () => {
        if (newMessage.length === 0) return;

        // Check for cooldown (3 messages in 3 seconds)
        const now = new Date();
        const threeSecondsAgo = new Date(now.getTime() - 3000);

        // Filter timestamps within the last 3 seconds
        const recentMessages = messageTimestamps.filter(
            timestamp => timestamp > threeSecondsAgo
        );

        if (recentMessages.length >= 2 && !cooldownActive) {
            // This would be the 3rd message in 3 seconds
            setCooldownActive(true);
            setTimeout(() => setCooldownActive(false), 6000);
            return;
        }

        if (cooldownActive) {
            return;
        }

        // Send the message
        const createdMessage = await createTicketMessage(newMessage, ticket.id, user?.id.toString() || "");

        // Immediately update UI with the new message
        if (createdMessage && user) {
            setMessages([...messages, {
                ...createdMessage,
                user: user
            }]);

            // Update lastMessageId if needed
            if (createdMessage.createdAt > lastMessage?.createdAt) {
                setLastMessage({ ...createdMessage, user });
            }
        }

        setMessageTimestamps([...messageTimestamps, now]);
        setNewMessage("");
    }

    const handleChangeStatus = async (id: number, status: string) => {
        await createLog(user?.id || 0, "Ticket Status Changed", `Ticket #${id} status changed from ${status.toLowerCase()} to ${status.toLowerCase()}`);
        await updateTicket(id, { status });

        const newMessage = `Status changed to ${status}`;

        // Send the message
        const createdMessage = await createTicketMessage(newMessage, ticket.id, user?.id.toString() || "");

        // Immediately update UI with the new message
        if (createdMessage && user) {
            setMessages([...messages, {
                ...createdMessage,
                user: user
            }]);

            // Update lastMessageId if needed
            if (createdMessage.createdAt > lastMessage?.createdAt) {
                setLastMessage({ ...createdMessage, user });
            }
        }

        setMessageTimestamps([...messageTimestamps, new Date()]);

        setStatus(status);
    }

    const [adminsIds, setAdminsIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            const admins = await getAdmins();
            setAdminsIds(admins.map((admin) => admin.userId));
        }
        fetchAdmins();
    }, []);

    return (
        <PopupWindowContainer title={`Ticket #${ticket.id}`} onClose={onClose}>
            <div className="flex flex-col gap-2 p-4 max-h-[90vh] ">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-primary flex justify-center items-center">
                                <p className="text-lg font-bold">{ticketOwner?.firstName.charAt(0) + ticketOwner?.lastName.charAt(0)}</p>
                            </div>
                            <p className="text-lg font-bold">{ticketOwner?.firstName + " " + ticketOwner?.lastName}</p>
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-lg">Status:</p>

                            {adminsIds.includes(user?.id || 0) ? (
                                <select className={`px-5 p-0.5 h-fit cursor-pointer rounded-md font-semibold ${status.toLowerCase() === "open" ? "bg-green-500" : status.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`} defaultValue={status} onChange={(e) => handleChangeStatus(ticket.id, e.target.value)}>
                                    <option value="open">Open</option>
                                    <option value="pending">Pending</option>
                                    <option value="closed">Closed</option>
                                </select>
                            )
                                :
                                <p className={`px-5 p-0.5 h-fit cursor-pointer rounded-md ${status.toLowerCase() === "open" ? "bg-green-500" : status.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`}>{status}</p>
                            }
                        </div>

                    </div>
                    <div className="flex justify-between gap-2">
                        <h2 className="text-xl font-bold">Title: {ticket.title}</h2>
                        <p className="text-sm text-gray-500 font-semibold">{ticket.createdAt.toLocaleString()}</p>
                    </div>
                </div>
                <div className={`flex flex-col gap-2 transition-all duration-500 rounded-md  bg-background-light dark:bg-background-dark ${lineClampDesc ? "" : " p-4  shadow-md scale-150 max-w-2xl   "} `}>
                    {lineClampDesc ?

                        <p className="font-bold">Description:</p>
                        :
                        <div className="flex justify-between">
                            <p className="font-bold">Description:</p>
                            <button onClick={() => { setLineClampDesc(!lineClampDesc) }}>
                                <span className="text-3xl">&times;</span>
                            </button>
                        </div>
                    }

                    <div className="flex flex-col" onClick={() => { setLineClampDesc(!lineClampDesc) }}>
                        <p className={`overflow-y-auto ${lineClampDesc ? "line-clamp-3" : "line-clamp-none"}`}>
                            {ticket.description}
                        </p>
                        <p className="text-nowrap w-fit underline-offset-2 cursor-pointer opacity-90 hover:underline hover:opacity-100 transition-all duration-300" onClick={() => { setLineClampDesc(!lineClampDesc) }}>
                            {lineClampDesc === true ? "View more" : "View less"}
                        </p>
                    </div>
                </div>
                <div className="border-t border-line-light my-4 dark:border-line-dark w-full"></div>
                <div className="flex flex-col gap-2 w-full max-w-full">
                    <h2 className="text-xl font-bold ">Messages:</h2>
                    <div
                        ref={messagesContainerRef}
                        className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto py-2"
                    >
                        {messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((message) => (
                            <div key={message.id} className={`rounded-md p-2 shadow-md w-fit flex flex-col max-w-[66%] text-wrap whitespace-normal dark:bg-backgroundSecondary-dark ${message.userId === user?.id ? "self-end" : "self-start"}`}>
                                <h3 className="text-lg font-semibold flex justify-between items-center gap-4">
                                    <span className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-primary flex justify-center items-center">
                                            <p className="text-sm font-bold">{message.user.firstName.charAt(0).toUpperCase() + message.user.lastName.charAt(0).toUpperCase()}</p>
                                        </div>
                                        {user?.id === message.userId ? "You" : message.user.firstName + " " + message.user.lastName}
                                    </span>
                                    <span className="text-sm text-gray-500">{message.createdAt.toLocaleString()}</span>
                                </h3>
                                <p className="text-wrap break-words">{message.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {cooldownActive && <p className="text-red-500">Please slow down. You're sending messages too quickly.</p>}
                <div className="flex gap-2">
                    <input type="text" placeholder="New message" className="w-full rounded-md p-2 shadow-md dark:bg-backgroundSecondary-dark" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }} />
                    <BaseButton className="w-fit shadow-md" onClick={handleSendMessage}>Send</BaseButton>
                </div>

            </div>
        </PopupWindowContainer >
    )
}

export default function TicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showTicketDetails, setShowTicketDetails] = useState(false);
    const [showTicketPopup, setShowTicketPopup] = useState(false);



    const handleClickTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
        redirect(`/dashboard/tickets?id=${ticket.id}`);
    }

    const handleCloseTicketCreation = () => {
        setShowTicketPopup(false);
    }

    const urlParams = useSearchParams();
    useEffect(() => {
        const fetchTicket = async () => {
            const ticketId = urlParams.get("id");
            if (ticketId) {
                const user = await getUser();
                const adminsIds = await getAdminsIds();
                const ticket = await getTicket(parseInt(ticketId || "0"));
                if (ticket && (ticket.userId === user?.id || adminsIds.includes(user?.id || 0))) {
                    setSelectedTicket(ticket);
                    setShowTicketDetails(true);
                } else {
                    redirect(`/dashboard/tickets`);
                }
            }
        }
        fetchTicket();
    }, []);



    return (
        <TableContainer title="Tickets" addButtonText="New Ticket" onAddClick={() => setShowTicketPopup(true)}>
            {showTicketPopup && <TicketPopup onClose={handleCloseTicketCreation} />}
            <TicketList handleClickTicket={handleClickTicket} />
            {showTicketDetails && <TicketDetails ticket={selectedTicket} onClose={() => {
                setShowTicketDetails(false);
                redirect(`/dashboard/tickets`); // Pour que si l'user reload apres avoir fermé la popup, elle ne se réaffiche pas
            }} />}
        </TableContainer>
    )
}