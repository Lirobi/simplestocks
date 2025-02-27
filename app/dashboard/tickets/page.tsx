"use client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import ClickableText from "@/components/ui/buttons/ClickableText";
import TableContainer from "@/components/ui/containers/TableContainer";
import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
import BaseTextArea from "@/components/ui/inputs/BaseTextArea";
import PopupWindowContainer from "@/components/ui/popups/PopupWindowContainer";
import { useState, useEffect } from "react";
import { createTicket, getTickets, updateTicket } from "@/lib/actions/tickets";
import { getUser } from "@/lib/actions/user";
import { User } from "@/lib/types/User";
import { Ticket, TicketMessage } from "@prisma/client";
import { getTicketsByUserId, getTicketMessages, createTicketMessage } from "@/lib/actions/tickets";




function TicketPopup({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    const handleCreateTicket = async () => {
        await createTicket(title, description, user?.id);
        onClose();
    }

    return (
        <PopupWindowContainer title="New Ticket" onClose={onClose}>
            <BaseFormInput label="Title" onChange={(e) => setTitle(e.target.value)} />
            <BaseTextArea label="Tell us more about the issue" onChange={(e) => setDescription(e.target.value)} />
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
                        <th className="text-center w-fit">Status</th>
                        <th className="text-center w-fit">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map((ticket) => (
                        <tr key={ticket.id} className=" shadow-md border border-gray-200 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300" onClick={() => handleClickTicket(ticket)}>
                            <td className="w-fit text-center p-2">{ticket.id}</td>
                            <td className="w-fit text-center p-2">{ticket.title}</td>
                            <td className="w-full flex justify-center items-center p-2">
                                <p className={`w-fit px-10 p-0.5 rounded-md ${ticket.status.toLowerCase() === "open" ? "bg-green-500" : ticket.status.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`}>{ticket.status}</p>
                            </td>
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

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();
    }, []);
    useEffect(() => {
        const fetchMessages = async () => {
            const messages = await getTicketMessages(ticket.id);
            const messagesWithUser: TicketMessageWithUser[] = [];
            for (const message of messages) {
                const user = await getUser(message.userId.toString());
                messagesWithUser.push({ ...message, user });
            }
            setMessages(messagesWithUser);
        }
        fetchMessages();
    }, []);


    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = async () => {
        await createTicketMessage(newMessage, ticket.id, user?.id);
        setMessages([...messages, { id: messages.length + 1, message: newMessage, ticketId: ticket.id, userId: user?.id, createdAt: new Date(), updatedAt: new Date(), user: user }]);
        setNewMessage("");
    }



    const handleChangeStatus = async (id: number, status: string) => {
        await updateTicket(id, { status });
        setStatus(status);
    }

    return (
        <PopupWindowContainer title={`Ticket #${ticket.id}`} onClose={onClose}>
            <div className="flex flex-col gap-2 p-4 ">
                <div className="flex justify-between gap-2">
                    <h2 className="text-xl font-bold">Title: {ticket.title}</h2>
                    <div className="flex gap-2">
                        <p className="font-bold">Status:</p>
                        <select className={`px-5 p-0.5 h-fit cursor-pointer rounded-md ${status.toLowerCase() === "open" ? "bg-green-500" : status.toLowerCase() === "pending" ? "bg-yellow-500" : "bg-red-500"}`} defaultValue={status} onChange={(e) => handleChangeStatus(ticket.id, e.target.value)}>
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Description:</p>
                    <p>{ticket.description}</p>
                </div>
                <div className="border-t border-line-light my-4 dark:border-line-dark w-full"></div>
                <div className="flex flex-col gap-2 w-full   ">
                    <h2 className="text-xl font-bold ">Messages:</h2>
                    <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto py-2">
                        {messages.map((message) => (
                            <div key={message.id} className={`rounded-md p-2 shadow-md w-fit flex flex-col ${message.userId === user?.id ? "self-end" : "self-start"}`}>
                                <h3 className="text-lg font-semibold">{user?.id === message.userId ? "You" : message.user.firstName + " " + message.user.lastName}   - <span className="text-sm text-gray-500">{message.createdAt.toLocaleString()}</span></h3>
                                <p>{message.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="New message" className="w-full rounded-md p-2 shadow-md" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }} />
                    <BaseButton className="w-fit shadow-md" onClick={handleSendMessage}>Send</BaseButton>
                </div>

            </div>
            <div className="flex justify-end gap-2">
                <ClickableText onClick={onClose} text="Close" />
            </div>
        </PopupWindowContainer >
    )
}
export default function TicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showTicketDetails, setShowTicketDetails] = useState(false);

    const handleClickTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetails(true);
    }

    const [showTicketPopup, setShowTicketPopup] = useState(false);
    return (
        <TableContainer title="Tickets" addButtonText="New Ticket" onAddClick={() => setShowTicketPopup(true)}>
            {showTicketPopup && <TicketPopup onClose={() => setShowTicketPopup(false)} />}
            <TicketList handleClickTicket={handleClickTicket} />
            {showTicketDetails && <TicketDetails ticket={selectedTicket} onClose={() => setShowTicketDetails(false)} />}
        </TableContainer>
    )
}