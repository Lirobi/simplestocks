"use server";

import prisma from "@/lib/prisma";
import { Ticket } from "@prisma/client";

export async function createTicket(title: string, description: string, userId: number) {
    return await prisma.ticket.create({ data: { title, description, userId } });
}

export async function getTickets() {
    return await prisma.ticket.findMany();
}

export async function getTicketsByUserId(userId: number) {
    return await prisma.ticket.findMany({ where: { userId } });
}


export async function updateTicket(id: number, data: Partial<Ticket>) {
    return await prisma.ticket.update({ where: { id }, data });
}

export async function deleteTicket(id: number) {
    return await prisma.ticket.delete({ where: { id } });
}

export async function getTicketMessages(ticketId: number, count: number, offset: number) {
    return await prisma.ticketMessage.findMany({ where: { ticketId }, take: count, skip: offset });
}

export async function createTicketMessage(message: string, ticketId: number, userId: string) {
    try {
        const createdMessage = await prisma.ticketMessage.create({
            data: {
                message,
                ticketId,
                userId: parseInt(userId)
            }
        });
        return createdMessage;
    } catch (error) {
        console.error("Error creating ticket message:", error);
        return null;
    }
}

export async function deleteTicketMessage(id: number) {
    return await prisma.ticketMessage.delete({ where: { id } });
}
