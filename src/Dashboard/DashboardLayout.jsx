import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
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
import LoadingSpinner from "../Components/LoadingSpinner";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, role, loading } = useAuth();
    const location = useLocation(); // 🔹 Get current path

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const allSidebarLinks = [
        { name: "Home", path: "/dashboard", icon: <FaHome />, roles: ["user", "admin"] },
        { name: "Profile", path: "/dashboard/profile", icon: <FaUser />, roles: ["user"] },
        { name: "Add Post", path: "/dashboard/addpost", icon: <FaPlus />, roles: ["user"] },
        { name: "My Posts", path: "/dashboard/myposts", icon: <FaPlus />, roles: ["user"] },
        { name: "Admin Profile", path: "/dashboard/adminprofile", icon: <FaUser />, roles: ["admin"] },
        { name: "Manage Users", path: "/dashboard/manageusers", icon: <FaUsers />, roles: ["admin"] },
        { name: "Announcements", path: "/dashboard/addannouncement", icon: <FaBullhorn />, roles: ["admin"] },
        { name: "Reported Comments", path: "/dashboard/reportedcomments", icon: <FaFlag />, roles: ["admin"] },
    ];

    const sidebarLinks = allSidebarLinks.filter(link => link.roles.includes(role));

    if (loading) return <LoadingSpinner />;

    if (!user) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Please log in to access the dashboard.</p>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const Sidebar = () => (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg">
            <div className="p-6 text-2xl font-bold text-blue-700">Dashboard</div>

            <div className="px-6 py-4 bg-gray-50 rounded-b">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-800 truncate">{user?.displayName || user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {role.toUpperCase()}
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map(link => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-3 p-3 rounded cursor-pointer transition
              ${location.pathname === link.path ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                    >
                        {link.icon}
                        <span className="font-medium">{link.name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );

    const MobileSidebar = () => (
        <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
            <aside className="relative w-64 bg-white shadow-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <span className="text-xl font-bold text-blue-700">Dashboard</span>
                    <button onClick={toggleSidebar} className="cursor-pointer">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="px-6 py-4 border-b bg-gray-50 rounded-b">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-semibold text-gray-800 truncate">{user?.displayName || user?.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {role.toUpperCase()}
                    </span>
                </div>

                <nav className="p-4 space-y-1">
                    {sidebarLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={toggleSidebar}
                            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition
                ${location.pathname === link.path ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                        >
                            {link.icon}
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            {sidebarOpen && <MobileSidebar />}

            <div className="flex-1 flex flex-col">
                <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow">
                    <button onClick={toggleSidebar} className="cursor-pointer">
                        <FaBars size={20} />
                    </button>
                    <span className="text-xl font-bold text-blue-700">Dashboard</span>
                    <div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{role.toUpperCase()}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
