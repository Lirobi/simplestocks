"use client";
import { useEffect, useState } from "react";
import { getUsers, getBusinesses, updateUser, getUserData } from "./actions";
import Link from "next/link";
import { Business, UserData } from "@prisma/client";



interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
    businessId: number;
    role: string;
    status: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    createdAt: Date;
    lastLogin?: Date;
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [businesses, setBusinesses] = useState([]);
    const [count, setCount] = useState(10);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData[]>([]);
    const [showUserData, setShowUserData] = useState(false);
    const [userToShow, setUserToShow] = useState<User | null>(null);


    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users as User[]);
        }
        fetchUsers();

        const fetchBusinesses = async () => {
            const businesses = await getBusinesses();
            setBusinesses(businesses as Business[]);
        }
        fetchBusinesses();

        const fetchUserData = async () => {
            const userData = await getUserData();
            setUserData(userData as UserData[]);
        }
        fetchUserData();
    }, []);

    const handleCountChange = (count: number) => {
        setCount(count);
        const fetchUsers = async () => {
            const users = await getUsers(count);
            setUsers(users as User[]);
        }
        fetchUsers();
    }

    const handleEdit = (user: User) => {
        setEditingUser({ ...user });
    };

    const handleCancel = () => {
        setEditingUser(null);
    };

    const handleSave = async () => {
        if (!editingUser) return;
        try {
            const updatedUser = await updateUser(editingUser);
            setUsers(users.map(user =>
                user.id === editingUser.id ? updatedUser : user
            ));
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h1>Users Table</h1>
            <select onChange={(e) => {
                setCount(parseInt(e.target.value));
                handleCountChange(parseInt(e.target.value));
            }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2 ">ID</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Name</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Email</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Phone</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Birth Date</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Business</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Role</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Status</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Address</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">City</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Postal Code</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Country</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Created At</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Last Login</th>
                        <th className="border border-line dark:border-line-dark border-line-light w-fit px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            {editingUser?.id === user.id ? (
                                <>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        {user.id}
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="text"
                                            value={editingUser.firstName}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                firstName: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                        <input
                                            type="text"
                                            value={editingUser.lastName}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                lastName: e.target.value
                                            })}
                                            className="w-full p-1 border rounded mt-1"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                email: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="tel"
                                            value={editingUser.phone}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                phone: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="date"
                                            value={editingUser.birthDate.toString().split('T')[0]}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                birthDate: new Date(e.target.value)
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <select
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                businessId: parseInt(e.target.value)
                                            })}
                                            className="w-full p-1 border rounded"
                                        >
                                            {businesses.map((business) => (
                                                <option key={business.id} value={business.id}>
                                                    {business.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                role: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Employee">Employee</option>
                                        </select>
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <select
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                status: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="text"
                                            value={editingUser.address}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                address: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="text"
                                            value={editingUser.city}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                city: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="text"
                                            value={editingUser.postalCode}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                postalCode: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <input
                                            type="text"
                                            value={editingUser.country}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                country: e.target.value
                                            })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        {user.createdAt.toString()}
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        {user.lastLogin?.toString()}
                                    </td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.id}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.firstName} {user.lastName}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.email}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.phone}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.birthDate.toString()}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{businesses.find((business) => business.id === user.businessId)?.name}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.role}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.status}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.address}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.city}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.postalCode}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.country}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.createdAt.toString()}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">{user.lastLogin?.toString()}</td>
                                    <td className="border border-line dark:border-line-dark border-line-light w-fit px-2 text-sm">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowUserData(true);
                                                setUserToShow(user);
                                            }}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Show User Data
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex flex-col gap-2">
                {
                    showUserData && userToShow && (
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/3 bg-white rounded-md shadow-md flex flex-col justify-center items-center">
                            <h1>{userToShow.firstName} {userToShow.lastName}</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Last IP</th>
                                        <th>Last Login</th>
                                        <th>Last Login Device</th>
                                        <th>Last Login Browser</th>
                                        <th>Last Login OS</th>
                                        <th>Last Login GPS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{userToShow.email}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginIp}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginDate.toString()}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginDevice}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginBrowser}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginOs}</td>
                                        <td>{userData.find((userData) => userData.userId === userToShow.id)?.lastLoginGPS}</td>
                                    </tr>
                                </tbody>

                            </table>

                            <button onClick={() => setShowUserData(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm top-4">Close</button>

                        </div>
                    )
                }
            </div>
        </div>
    )
}