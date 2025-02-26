"use server";

import prisma from "@/lib/prisma";
import { Business, User, Log } from "@prisma/client";
import { cpuUsage, memoryUsage } from "process";



export async function getCpuUsage() {
    const cpuUsageValue = await cpuUsage().system;
    const finalCPUUsage = Math.round(cpuUsageValue * 100) / 100; // Round to 2 decimal places
    // Calculate CPU usage percentage based on the difference between measurements
    const startUsage = cpuUsage();

    // Wait a small interval to measure difference
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the CPU usage after the interval
    const endUsage = cpuUsage();

    // Calculate the percentage based on the difference
    const userDiff = endUsage.user - startUsage.user;
    const systemDiff = endUsage.system - startUsage.system;
    const totalDiff = userDiff + systemDiff;

    // Convert to percentage (microseconds to percentage)
    const percentage = (totalDiff / 1000 / 100);

    // Use the calculated percentage instead of the raw value
    return Math.min(100, Math.max(0, Math.round(percentage * 100)));

    return finalCPUUsage;
}

export async function getMemoryUsage() {
    const memoryUsageValue = await memoryUsage().heapUsed;
    const finalMemoryUsage = Math.round(memoryUsageValue / 1024 / 1024);

    return finalMemoryUsage;
}

export async function toggleMaintenance() {
    const appStatus = await prisma.appStatus.findFirst();
    if (appStatus?.status === "Active") {
        await prisma.appStatus.update({
            where: { id: appStatus.id },
            data: { status: "Maintenance" }
        });
    } else {
        await prisma.appStatus.update({
            where: { id: appStatus.id },
            data: { status: "Active" }
        });
    }
}

export async function getProductsCount() {
    const products = await prisma.product.findMany();
    return products.length;
}

export async function getAppStatus() {
    const appStatus = await prisma.appStatus.findFirst();
    return appStatus;
}

export async function getLogs(count?: number) {
    if (!count) {
        const logs = await prisma.log.findMany();
        return logs;
    }
    const logs = await prisma.log.findMany({
        take: count,
        skip: count ? count * 10 : 0
    });
    return logs;
}

export async function getVisits() {
    const visits = await prisma.visit.findMany();
    return visits;
}

export async function getUserData() {
    const userData = await prisma.userData.findMany();
    return userData;
}

export async function getUsers(count?: number) {
    if (!count) {
        const users = await prisma.user.findMany();
        return users;
    }
    const users = await prisma.user.findMany({
        take: count,
        skip: count ? count * 10 : 0
    });
    return users;
}

export async function updateUser(user: User): Promise<User> {
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: user
    });
    return updatedUser;
}
export async function getBusinesses(count?: number) {
    if (!count) {
        const businesses = await prisma.business.findMany();
        return businesses;
    }
    const businesses = await prisma.business.findMany({
        take: count,
        skip: count ? count * 10 : 0
    });
    return businesses;
}

export async function createBusiness(business: Business) {
    console.log(business);
    try {
        const newBusiness = await prisma.business.create({
            data: business
        });
        return newBusiness;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateBusiness(business: Business): Promise<Business> {
    const updatedBusiness = await prisma.business.update({
        where: {
            id: business.id
        },
        data: business
    });
    return updatedBusiness;
}

export async function deleteBusiness(id: number): Promise<void> {
    await prisma.business.delete({
        where: {
            id: id
        }
    });
}