// import React, { useState } from "react";
// import { Link, Outlet } from "react-router";
// import { FaBars, FaTimes, FaHome, FaUser, FaPlus } from "react-icons/fa";

// export default function DashboardLayout() {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//     const sidebarLinks = [
//         { name: "Dashboard Home", path: "/dashboard", icon: <FaHome /> },
//         { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
//         { name: "Add Post", path: "/dashboard/addpost", icon: <FaPlus /> },
//         { name: "My Posts", path: "/dashboard/myposts", icon: <FaPlus /> },
//         { name: "Manage Users", path: "/dashboard/manageusers", icon: <FaPlus /> },
//         { name: "Add Announcement", path: "/dashboard/addannouncement", icon: <FaPlus /> },
//         { name: "Reported Comments", path: "/dashboard/reportedcomments", icon: <FaPlus /> },
//         // Add more links here
//     ];

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar for large screens */}
//             <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r shadow-md">
//                 <div className="p-6 text-2xl font-bold">Dashboard</div>
//                 <nav className="flex-1 p-4 space-y-2">
//                     {sidebarLinks.map((link) => (
//                         <Link
//                             key={link.name}
//                             to={link.path}
//                             className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
//                         >
//                             {link.icon}
//                             <span>{link.name}</span>
//                         </Link>
//                     ))}
//                 </nav>
//             </aside>

//             {/* Mobile sidebar overlay */}
//             {sidebarOpen && (
//                 <div className="fixed inset-0 z-40 flex lg:hidden">
//                     <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
//                     <aside className="relative w-64 bg-white shadow-md">
//                         <div className="flex justify-between items-center p-6 border-b">
//                             <span className="text-xl font-bold">Dashboard</span>
//                             <button onClick={toggleSidebar}>
//                                 <FaTimes size={20} />
//                             </button>
//                         </div>
//                         <nav className="p-4 space-y-2">
//                             {sidebarLinks.map((link) => (
//                                 <Link
//                                     key={link.name}
//                                     to={link.path}
//                                     onClick={toggleSidebar}
//                                     className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
//                                 >
//                                     {link.icon}
//                                     <span>{link.name}</span>
//                                 </Link>
//                             ))}
//                         </nav>
//                     </aside>
//                 </div>
//             )}

//             {/* Main content */}
//             <div className="flex-1 flex flex-col">
//                 {/* Top bar for mobile */}
//                 <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow">
//                     <button onClick={toggleSidebar}>
//                         <FaBars size={20} />
//                     </button>
//                     <span className="text-xl font-bold">Dashboard</span>
//                     <div>{/* Placeholder for user avatar or actions */}</div>
//                 </header>

//                 {/* Page content */}
//                 <main className="flex-1 overflow-auto p-6">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }



import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router";
import { FaBars, FaTimes, FaHome, FaUser, FaPlus, FaUsers, FaBullhorn, FaFlag } from "react-icons/fa";
import { useAuth } from "../Components/AuthContext"; // Import your auth context

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, role, loading } = useAuth(); // Get user, role, and loading state

    // Debug logs to see what values we're getting
    useEffect(() => {
        console.log("=== DashboardLayout Debug ===");
        console.log("user:", user);
        console.log("role:", role);
        console.log("role type:", typeof role);
        console.log("loading:", loading);
        console.log("============================");
    }, [user, role, loading]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Define all possible sidebar links with role requirements
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

    // Filter sidebar links based on user role
    const sidebarLinks = allSidebarLinks.filter(link => {
        const hasRole = link.roles.includes(role);
        console.log(`Link: ${link.name}, Required roles: [${link.roles.join(', ')}], User role: "${role}", Has access: ${hasRole}`);
        return hasRole;
    });

    console.log("Filtered sidebar links:", sidebarLinks.length);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="ml-4">Loading authentication...</p>
                </div>
            </div>
        );
    }

    // Show message if user is not authenticated
    if (!user) {
        return (
            <div className="flex h-screen bg-gray-100">
                <div className="flex-1 flex items-center justify-center">
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
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for large screens */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r shadow-md">
                <div className="p-6 text-2xl font-bold">Dashboard</div>

                {/* Show user info with debug information */}
                <div className="px-6 py-2 border-b bg-gray-50">
                    <p className="text-sm text-gray-600">Welcome back!</p>
                    <p className="font-medium text-gray-800">{user?.displayName || user?.email}</p>
                    <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Role: "{role}" (Type: {typeof role})
                        </span>
                    </div>
                    <div className="mt-1">
                        <span className="text-xs text-gray-500">
                            Links found: {sidebarLinks.length}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {/* Always show debug info */}
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <p><strong>Debug Info:</strong></p>
                        <p>User: {user ? 'Found' : 'Not found'}</p>
                        <p>Role: "{role}" ({typeof role})</p>
                        <p>Loading: {loading.toString()}</p>
                        <p>Available links: {sidebarLinks.length}</p>
                    </div>

                    {sidebarLinks.length > 0 ? (
                        sidebarLinks.map((link) => (
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
                        <div className="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded">
                            <p><strong>No menu items available!</strong></p>
                            <div className="mt-2 text-xs text-left">
                                <p>Current role: "{role}"</p>
                                <p>Expected roles: "user" or "admin"</p>
                                <p>Role type: {typeof role}</p>
                                <p>Is null/undefined: {role == null ? 'Yes' : 'No'}</p>
                                <p>Is empty string: {role === '' ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    )}
                </nav>
            </aside>

            {/* Mobile sidebar overlay - similar structure with debug info */}
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

                        {/* Mobile user info with debug */}
                        <div className="px-6 py-2 border-b bg-gray-50">
                            <p className="text-sm text-gray-600">Welcome back!</p>
                            <p className="font-medium text-gray-800">{user?.displayName || user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                "{role}" ({typeof role})
                            </span>
                        </div>

                        <nav className="p-4 space-y-2">
                            {sidebarLinks.length > 0 ? (
                                sidebarLinks.map((link) => (
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
                {/* Top bar for mobile */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b shadow">
                    <button onClick={toggleSidebar}>
                        <FaBars size={20} />
                    </button>
                    <span className="text-xl font-bold">Dashboard</span>
                    <div className="text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            "{role}"
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    {/* Only render content if user is authenticated and role is loaded */}
                    {!loading && user && role ? (
                        <Outlet />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading dashboard...</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    <p>Loading: {loading.toString()}</p>
                                    <p>User: {user ? 'Found' : 'Missing'}</p>
                                    <p>Role: "{role}"</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}