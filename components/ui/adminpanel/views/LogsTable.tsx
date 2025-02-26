"use client"
import { getLogs, getUsers } from "./actions";
import { useState, useEffect } from "react";
import { Log, User } from "@prisma/client";
export default function LogsTable() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [hideActions, setHideActions] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await getLogs();
            setLogs(logs);
        }

        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users);
        }
        fetchLogs();
        fetchUsers();


        setHideActions([]);
    }, []);


    const handleHideActions = (e: React.ChangeEvent<HTMLFieldSetElement>) => {
        const checked = e.target.checked;
        const value = e.target.value;
        if (checked) {
            setHideActions([...hideActions, value]);
        } else {
            setHideActions(hideActions.filter((action) => action !== value));
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchResults(users.filter((user) => user.email.toLowerCase().includes(value.toLowerCase())));
        setSearch(value);
    }
    return (
        <div className="flex flex-col gap-2 w-full justify-center items-center">
            <div className="flex flex-row gap-2">
                <div className="relative group">
                    <input type="text" placeholder="Search" className="group" onChange={(e) => handleSearch(e)} />
                    <div className="absolute left-0 w-full h-fit bg-white group-hover:block group-focus:block hidden">
                        {searchResults.map((user) => (
                            <div className="hover:bg-gray-200 cursor-pointer" onClick={() => {
                                setSearch(user.email)
                                setSelectedUser(user)
                                setSearchResults([])
                            }} key={user.id}>{user.email}</div>
                        ))}
                    </div>
                </div>
                <fieldset className="flex flex-row gap-2" onChange={(e) => handleHideActions(e)}>
                    <legend>Hide</legend>
                    <input type="checkbox" id="login" value="LOGIN" />
                    <label htmlFor="login">Login</label>
                    <input type="checkbox" id="logout" value="LOGOUT" />
                    <label htmlFor="logout">Logout</label>
                    <input type="checkbox" id="register" value="REGISTER" />
                    <label htmlFor="register">Register</label>
                </fieldset>
            </div>
            <h2 className="text-2xl font-bold">{selectedUser ? selectedUser.email : "Please select a user"}</h2>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.filter((log) => selectedUser ? log.userId === selectedUser.id : true).filter((log) => !hideActions.includes(log.action)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((log) => (
                        <tr key={log.id}>
                            <td className={`text-center border-black border ${log.action === "LOGIN" ? "bg-green-500" : log.action === "LOGOUT" ? "bg-red-500" : "bg-gray-500"}`}>{log.action}</td>
                            <td className="text-center border-black border">{log.description}</td>
                            <td className="text-center border-black border">{log.createdAt.toLocaleString()}</td>
                            <td className="text-center border-black border">{log.ipAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}