"use client";
import { useState, useEffect } from "react";
import { toggleMaintenance, getAppStatus, getUsers, getBusinesses, getProductsCount, getCpuUsage, getMemoryUsage, getLogs, getVisits } from "./actions";
import { Log, User, Visit } from "@prisma/client";
import { addAdmin, getAdmins, removeAdmin } from "@/lib/actions/user";
import BaseButton from "@/components/ui/buttons/BaseButton";
import BaseFormInput from "@/components/ui/inputs/BaseFormInput";
const cpuUsageHistory = [];
const memoryUsageHistory = [];

const MAX_HISTORY_POINTS = 30; // Limit the number of data points to display

function Card({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 shadow-sm p-4 rounded-lg border-gray-500 border">
            <h2 className="text-lg font-bold">{title}</h2>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    )
}

function ToggleButton({ checked, onClick }: { checked: boolean, onClick: () => void }) {
    return (
        <div className="flex gap-2">
            <label htmlFor="maintenance-mode" className="text-sm font-medium">
                Maintenance mode
            </label>
            <div className="relative z-50">
                <input
                    type="checkbox"
                    id="maintenance-mode"
                    className="sr-only peer cursor-pointer"
                    checked={checked}
                    onChange={() => { }}
                />
                <div className="h-6 w-11 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:shadow-md after:transition-transform peer-checked:after:translate-x-5"
                    onClick={onClick}
                ></div>
            </div>
        </div>
    )
}

function NumberGraph({ data, type }: { data: number[], type: "cpu" | "memory" }) {
    const maxValue = data.length > 0 ? Math.max(...data) : 100;

    return (
        <div className="relative w-full h-[100px] border-b border-l border-gray-300 mt-5">
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-start overflow-hidden">
                {data.map((usage, index) => (
                    <div
                        key={index}
                        className="w-2 bg-blue-600 rounded-t-sm mx-0.5 transition-all duration-300 group"
                        style={{
                            height: `${type === "cpu" ? `${Math.max(5, (usage / maxValue) * 100)}%` : `${Math.max(5, (usage / maxValue) * 100)}%`}`
                        }}
                    >
                        <p className="hidden group-hover:block cursor-default border border-gray-300 shadow-md rounded-md p-0.5 w-fit ml-3">{usage} {type === "cpu" ? "%" : "MB"}</p>
                    </div>
                ))}
            </div>
            <div className="absolute -left-4 -top-5 h-[120%] flex flex-col justify-between text-xs text-gray-500 px-1">
                <span>{maxValue} {type === "cpu" ? "%" : "MB"}</span>
                <span>0</span>
            </div>
        </div>
    )
}

function VisitsGraph({ data }: { data: Visit[] }) {
    // Group visits by day
    const visitsByDay = data.reduce((acc, visit) => {
        const dateStr = visit.createdAt.toLocaleDateString();
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(visit);
        return acc;
    }, {} as Record<string, Visit[]>);

    // Convert to array of [date, count] pairs and sort by date
    const dailyVisits = Object.entries(visitsByDay)
        .map(([date, visits]) => ({
            date: new Date(date),
            count: visits.length
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const maxValue = dailyVisits.length > 0 ? Math.max(...dailyVisits.map(day => day.count)) : 1;

    return (
        <div className="relative w-full h-[100px] border-b border-l border-gray-300 mt-5">
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-start overflow-hidden">
                {dailyVisits.map((day, index) => (
                    <div
                        key={index}
                        className="w-2 bg-blue-600 rounded-t-sm mx-0.5 transition-all duration-300 group"
                        style={{
                            height: `${Math.max(5, (day.count / maxValue) * 100)}%`
                        }}
                    >
                        <p className="hidden group-hover:block cursor-default border border-gray-300 shadow-md rounded-md p-0.5 w-fit ml-3 ">
                            {day.date.toLocaleDateString()} - {day.count} visits
                        </p>
                    </div>
                ))}
            </div>
            <div className="absolute -left-4 -top-5 h-[120%] flex flex-col justify-between text-xs text-gray-500 px-1">
                <span>{maxValue} visits</span>
                <span>0</span>
            </div>
        </div>
    )
}
export default function ManageApp() {

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const handleSetMaintenanceMode = () => {
        setMaintenanceMode(!maintenanceMode);
        toggleMaintenance();
    }

    const [users, setUsers] = useState(0);
    const [businesses, setBusinesses] = useState(0);
    const [products, setProducts] = useState(0);

    const [cpuUsageData, setCpuUsageData] = useState(0);
    const [memoryUsageData, setMemoryUsageData] = useState(0);
    const [cpuHistory, setCpuHistory] = useState<number[]>([]);
    const [memoryHistory, setMemoryHistory] = useState<number[]>([]);

    const [logs, setLogs] = useState<Log[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);

    const [visits, setVisits] = useState<Visit[]>([]);

    const [admins, setAdmins] = useState<number[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState<string>("");
    const [showNewAdminPopup, setShowNewAdminPopup] = useState<boolean>(false);
    const [showRemoveAdminPopup, setShowRemoveAdminPopup] = useState<boolean>(false);
    const [adminToRemove, setAdminToRemove] = useState<number>(0);

    useEffect(() => {
        const fetchAppStatus = async () => {
            const appStatus = await getAppStatus();
            setMaintenanceMode(appStatus?.status === "Maintenance");
        }
        fetchAppStatus();

        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users.length);
        }
        fetchUsers();

        const fetchBusinesses = async () => {
            const businesses = await getBusinesses();
            setBusinesses(businesses.length);
        }
        fetchBusinesses();

        const fetchProducts = async () => {
            const products = await getProductsCount();
            setProducts(products);
        }
        fetchProducts();


        const fetchLogs = async () => {
            const logs = await getLogs(5);
            setLogs(logs);
            setTimeout(fetchLogs, 1000);
        }
        fetchLogs();

        const fetchUsersList = async () => {
            const users = await getUsers();
            setUsersList(users);
        }
        fetchUsersList();

        const fetchAnalytics = async () => {
            const visits = await getVisits();
            setVisits(visits);
            setTimeout(fetchAnalytics, 1000);
        }
        fetchAnalytics();

        const fetchAdmins = async () => {
            const admins = await getAdmins();
            setAdmins(admins.map((admin) => admin.userId));
        }
        fetchAdmins();

    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchCpuUsage = async () => {
            if (!isMounted) return;

            const cpuUsageValue = await getCpuUsage();
            setCpuUsageData(cpuUsageValue);

            setCpuHistory(prevHistory => {
                const newHistory = [...prevHistory, cpuUsageValue];
                // Keep only the most recent data points
                return newHistory.slice(-MAX_HISTORY_POINTS);
            });

            if (isMounted) {
                setTimeout(fetchCpuUsage, 1000);
            }
        }

        fetchCpuUsage();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchMemoryUsage = async () => {
            if (!isMounted) return;

            const memoryUsageValue = await getMemoryUsage();
            setMemoryUsageData(memoryUsageValue);

            setMemoryHistory(prevHistory => {
                const newHistory = [...prevHistory, memoryUsageValue];
                return newHistory.slice(-MAX_HISTORY_POINTS);
            });

            if (isMounted) {
                setTimeout(fetchMemoryUsage, 1000);
            }
        }

        fetchMemoryUsage();

        return () => {
            isMounted = false;
        };
    }, []);


    const handleAddAdmin = async () => {
        const user = usersList.find((user) => user.email === newAdminEmail);
        if (user) {
            await addAdmin(user.id);
            setShowNewAdminPopup(false);
        }
    }

    const handleRemoveAdmin = async () => {
        await removeAdmin(adminToRemove);
        setShowRemoveAdminPopup(false);
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <Card title="Settings">
                    <ToggleButton checked={maintenanceMode} onClick={handleSetMaintenanceMode} />
                </Card>

                <Card title="Stats">
                    <div className="flex flex-col">
                        <p>Users: {users}</p>
                        <p>Businesses: {businesses}</p>
                        <p>Products: {products}</p>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Card title="System Info">
                    <div className="flex flex-col">
                        <p>CPU Usage: {cpuUsageData}%</p>
                        <p>Memory Usage: {memoryUsageData} MB</p>
                    </div>
                </Card>

                <Card title="CPU Usage History">
                    <div className="flex flex-col w-full">
                        <NumberGraph data={cpuHistory} type="cpu" />
                    </div>
                </Card>

                <Card title="Memory Usage History">
                    <div className="flex flex-col w-full">
                        <NumberGraph data={memoryHistory} type="memory" />
                    </div>
                </Card>
            </div>
            <div className="grid gap-4">
                <Card title="Latest Logs">
                    <div className="flex flex-col w-full">
                        <table className="w-full">
                            <tbody className="flex flex-col gap-1 w-full">

                                {logs.map((log) => (
                                    <tr key={log.id} className="w-full border-b border-black">
                                        <td className="px-2">{usersList.find((user) => user.id === log.userId)?.email}</td>
                                        <td className="px-2">{log.action}</td>
                                        <td className="px-2">{log.createdAt.toLocaleString()}</td>
                                        <td className="px-2">{log.ipAddress}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="grid gap-4">
                <Card title="Analytics">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row justify-between w-full">
                            <div className="flex flex-col">
                                <p>Total visitors: {visits.filter((visit, index, self) =>
                                    index === self.findIndex((t) => t.ipAddress === visit.ipAddress)
                                ).length}</p>
                            </div>
                            <div className="flex flex-col">
                                <p>Visitors today: {visits.filter((visit, index, self) =>
                                    index === self.findIndex((t) => t.ipAddress === visit.ipAddress) && visit.createdAt.toLocaleDateString() === new Date().toLocaleDateString()
                                ).length}</p>
                            </div>
                        </div>
                        <h1 className="text-lg font-bold">Visits per day</h1>

                        <VisitsGraph data={visits.filter((visit, index, self) =>
                            index === self.findIndex((t) => t.ipAddress === visit.ipAddress)
                        )} />
                    </div>
                </Card>
            </div>
            <div className="grid gap-4">
                <Card title="Admins">
                    <div className="flex justify-between w-full">
                        <div className="flex flex-col gap-2">
                            {admins.map((admin) => (
                                <div key={admin} className="flex justify-between w-full">
                                    <p>{usersList.find((user) => user.id === admin)?.email}</p>
                                    <BaseButton onClick={() => { setAdminToRemove(admin); setShowRemoveAdminPopup(true); handleRemoveAdmin(); }}>Remove</BaseButton>
                                </div>
                            ))}
                        </div>
                        <BaseButton onClick={() => setShowNewAdminPopup(true)}>Add Admin</BaseButton>
                    </div>
                </Card>
            </div>
            {showNewAdminPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg">
                        <p>Add Admin</p>
                        <BaseFormInput label="Email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
                        <BaseButton onClick={handleAddAdmin}>Add</BaseButton>
                    </div>
                </div>
            )}
        </div>
    )
}