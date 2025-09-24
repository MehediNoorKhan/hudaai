import { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";

export default function ManageUsers() {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/users"); // backend endpoint to fetch all users
                if (res.data.success) {
                    setUsers(res.data.data);
                } else {
                    setError("Failed to fetch users");
                }
            } catch (err) {
                console.error(err);
                setError("Error loading users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [axiosSecure]);

    // Make a user admin
    const makeAdmin = async (userId) => {
        if (!window.confirm("Are you sure you want to make this user an admin?")) return;

        try {
            const res = await axiosSecure.patch(`/users/make-admin/${userId}`);
            if (res.data.success) {
                // Update state locally
                setUsers(users.map(u => u._id === userId ? { ...u, role: "admin" } : u));
                alert("User is now an admin");
            } else {
                alert("Failed to update user role");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating user role");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading users...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-3 text-left">Name</th>
                            <th className="border border-gray-200 p-3 text-left">Email</th>
                            <th className="border border-gray-200 p-3 text-center">Role</th>
                            <th className="border border-gray-200 p-3 text-center">Make Admin</th>
                            <th className="border border-gray-200 p-3 text-center">Subscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3 flex items-center gap-2">
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span>{user.fullName}</span>
                                </td>
                                <td className="border border-gray-200 p-3">{user.email}</td>
                                <td className="border border-gray-200 p-3 text-center font-medium">
                                    {user.role}
                                </td>
                                <td className="border border-gray-200 p-3 text-center">
                                    {user.role === "admin" ? (
                                        <span className="text-green-600 font-semibold">Admin</span>
                                    ) : (
                                        <button
                                            onClick={() => makeAdmin(user._id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                                <td className="border border-gray-200 p-3 text-center">
                                    {user.membership === "yes" ? (
                                        <span className="text-green-600 font-medium">{user.user_status}</span>
                                    ) : (
                                        <span className="text-gray-500">No Membership</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
