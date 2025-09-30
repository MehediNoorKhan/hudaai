import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import {
    FaBars,
    FaTimes,
    FaHome,
    FaUser,
    FaPlus,
    FaUsers,
    FaBullhorn,
    FaFlag,
} from "react-icons/fa";
import { useAuth } from "../Components/AuthContext";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, role, loading } = useAuth();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Define sidebar links based on role
    const allSidebarLinks = [
        { name: "Dashboard Home", path: "/dashboard", icon: <FaHome />, roles: ["user", "admin"] },
        { name: "Profile", path: "/dashboard/profile", icon: <FaUser />, roles: ["user"] },
        { name: "Add Post", path: "/dashboard/addpost", icon: <FaPlus />, roles: ["user"] },
        { name: "My Posts", path: "/dashboard/myposts", icon: <FaPlus />, roles: ["user"] },
        { name: "Profile", path: "/dashboard/adminprofile", icon: <FaUser />, roles: ["admin"] },
        { name: "Manage Users", path: "/dashboard/manageusers", icon: <FaUsers />, roles: ["admin"] },
        { name: "Add Announcement", path: "/dashboard/addannouncement", icon: <FaBullhorn />, roles: ["admin"] },
        { name: "Reported Comments", path: "/dashboard/reportedcomments", icon: <FaFlag />, roles: ["admin"] },
    ];

    // Filter links by role
    const sidebarLinks = allSidebarLinks.filter(link => link.roles.includes(role));

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4">Loading authentication...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Please log in to access the dashboard.</p>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r shadow-md">
                <div className="p-6 text-2xl font-bold">Dashboard</div>

                <div className="px-6 py-2 border-b bg-gray-50">
                    <p className="text-sm text-gray-600">Welcome back!</p>
                    <p className="font-medium text-gray-800">{user?.displayName || user?.email}</p>
                    <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Role: "{role}"
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.length > 0 ? (
                        sidebarLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))
                    ) : (
                        <div className="p-4 text-center text-red-500 bg-red-50 rounded">
                            <p>No menu items!</p>
                            <p className="text-xs">Role: "{role}"</p>
                        </div>
                    )}
                </nav>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
                    <aside className="relative w-64 bg-white shadow-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <span className="text-xl font-bold">Dashboard</span>
                            <button onClick={toggleSidebar}>
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-2 border-b bg-gray-50">
                            <p className="text-sm text-gray-600">Welcome back!</p>
                            <p className="font-medium text-gray-800">{user?.displayName || user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                "{role}"
                            </span>
                        </div>

                        <nav className="p-4 space-y-2">
                            {sidebarLinks.length > 0 ? (
                                sidebarLinks.map(link => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={toggleSidebar}
                                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                                    >
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center text-red-500 bg-red-50 rounded">
                                    <p>No menu items!</p>
                                    <p className="text-xs">Role: "{role}"</p>
                                </div>
                            )}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow">
                    <button onClick={toggleSidebar}>
                        <FaBars size={20} />
                    </button>
                    <span className="text-xl font-bold">Dashboard</span>
                    <div className="text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">"{role}"</span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {/* This is where child routes render */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
