import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import { FaBars, FaTimes, FaHome, FaUser, FaPlus } from "react-icons/fa";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const sidebarLinks = [
        { name: "Dashboard Home", path: "/dashboard", icon: <FaHome /> },
        { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
        { name: "Add Post", path: "/dashboard/addpost", icon: <FaPlus /> },
        { name: "My Posts", path: "/dashboard/myposts", icon: <FaPlus /> },
        { name: "Manage Users", path: "/dashboard/manageusers", icon: <FaPlus /> },
        { name: "Add Announcement", path: "/dashboard/addannouncement", icon: <FaPlus /> },
        { name: "Reported Comments", path: "/dashboard/reportedcomments", icon: <FaPlus /> },
        // Add more links here
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for large screens */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r shadow-md">
                <div className="p-6 text-2xl font-bold">Dashboard</div>
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile sidebar overlay */}
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
                        <nav className="p-4 space-y-2">
                            {sidebarLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={toggleSidebar}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar for mobile */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow">
                    <button onClick={toggleSidebar}>
                        <FaBars size={20} />
                    </button>
                    <span className="text-xl font-bold">Dashboard</span>
                    <div>{/* Placeholder for user avatar or actions */}</div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
