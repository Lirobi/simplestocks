"use client";
import { useState, useEffect } from "react";
import { toggleMaintenance, getAppStatus } from "./actions";
export default function ManageApp() {

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const handleSetMaintenanceMode = () => {
        setMaintenanceMode(!maintenanceMode);
        toggleMaintenance();
    }

    useEffect(() => {
        const fetchAppStatus = async () => {
            const appStatus = await getAppStatus();
            setMaintenanceMode(appStatus?.status === "Maintenance");
        }
        fetchAppStatus();
    }, []);
    return (
        <div>
            <div className="flex flex-col gap-4 shadow-md p-4 rounded-md w-fit h-fit">
                <h1 className="text-2xl font-bold">Manage App</h1>
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold">App Status</h2>
                    <div className="flex items-center gap-3">
                        <label htmlFor="maintenance-mode" className="text-sm font-medium">
                            Maintenance mode
                        </label>
                        <div className="relative z-50">
                            <input
                                type="checkbox"
                                id="maintenance-mode"
                                className="sr-only peer cursor-pointer"
                                checked={maintenanceMode}
                            />
                            <div className="h-6 w-11 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:shadow-md after:transition-transform peer-checked:after:translate-x-5"

                                onClick={handleSetMaintenanceMode}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}