import { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Swal from "sweetalert2";
import LoadingSpinner from "../Components/LoadingSpinner";
import FailedToLoad from "../Components/FailedToLoad";

export default function ManageUsers() {
    const axiosSecure = useAxiosSecure();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/users");
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

    const makeAdmin = async (userId, userName) => {

        const result = await Swal.fire({
            title: "Make Admin?",
            text: `Are you sure you want to make ${userName} an admin?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, make admin",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/make-admin/${userId}`);
            if (res.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: "admin" } : u));

                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: `${userName} is now an admin!`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: "Failed to update user role",
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error updating user role",
            });
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <FailedToLoad message={error} />;

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
                        {users.map((user, index) => (
                            <tr
                                key={user._id}
                                className="hover:bg-gray-50 transition cursor-pointer animate-slideUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <td className="border border-gray-200 p-3 flex items-center gap-2">
                                    <img
                                        src={user.avatar}
                                        alt={user.fullName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span>{user.fullName}</span>
                                </td>
                                <td className="border border-gray-200 p-3">{user.email}</td>
                                <td className="border border-gray-200 p-3 text-center font-medium">{user.role}</td>
                                <td className="border border-gray-200 p-3 text-center">
                                    {user.role === "admin" ? (
                                        <span className="text-green-600 font-semibold">Admin</span>
                                    ) : (
                                        <AwesomeButton
                                            type="primary"
                                            size="medium"
                                            onPress={() => makeAdmin(user._id, user.fullName)}
                                        >
                                            Make Admin
                                        </AwesomeButton>
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

            {/* Animations */}
            <style>
                {`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }
      `}
            </style>
        </div>
    );
}

