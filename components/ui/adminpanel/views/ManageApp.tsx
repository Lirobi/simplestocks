"use client";
import { useState, useEffect } from "react";
import { toggleMaintenance, getAppStatus, getUsers, getBusinesses, getProductsCount, getCpuUsage, getMemoryUsage } from "./actions";

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
                        className="w-2 bg-blue-600 rounded-t-sm mx-0.5 transition-all duration-300"
                        style={{
                            height: `${type === "cpu" ? `${Math.max(5, (usage / maxValue) * 100)}%` : `${Math.max(5, (usage / maxValue) * 100)}%`}`
                        }}
                    />
                ))}
            </div>
            <div className="absolute left-0 -top-5 w-full flex justify-between text-xs text-gray-500 px-1">
                <span>0</span>
                <span>{maxValue} {type === "cpu" ? "%" : "MB"}</span>
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
        </div>
    )
}