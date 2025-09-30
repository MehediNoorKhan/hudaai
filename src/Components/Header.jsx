import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import logo from "../assets/convonest.PNG";
import { AuthContext } from "./AuthContext";
import { Bell } from "lucide-react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Header = () => {
    const { user, logOut } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/announcements/count`);
                const data = await res.json();
                setAnnouncementCount(data.count || 0);
            } catch (err) {
                console.error("Failed to fetch announcement count:", err);
            }
        };

        fetchCount();
    }, []);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="navbar bg-base-100 shadow-md px-6">
            {/* Left - Logo + Name */}
            <div className="navbar-start">
                <Link
                    to="/"
                    className="flex items-center gap-2 btn btn-ghost normal-case text-xl hover:bg-gray-100 focus:ring-2 focus:ring-primary"
                >
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <span className="font-bold">CONVONEST</span>
                </Link>
            </div>

            {/* Center - Navigation */}
            <div className="navbar-center hidden md:flex gap-6 items-center">
                <Link
                    to="/"
                    className={`px-2 py-1 rounded-md transition ${isActive("/") ? "text-primary font-semibold border-b-2 border-primary" : "hover:text-primary"
                        }`}
                >
                    Home
                </Link>
                <Link
                    to="/membership"
                    className={`px-2 py-1 rounded-md transition ${isActive("/membership")
                        ? "text-primary font-semibold border-b-2 border-primary"
                        : "hover:text-primary"
                        }`}
                >
                    Membership
                </Link>
            </div>

            {/* Right - Buttons / Profile */}
            <div className="navbar-end gap-3 relative flex items-center">
                {/* Notification Bell with count */}
                <div className="relative mr-4 cursor-pointer hover:text-primary">
                    <Bell size={24} />
                    {announcementCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {announcementCount}
                        </span>
                    )}
                </div>

                {!user ? (
                    <div className="flex gap-2">
                        <Link to="/login">
                            <AwesomeButton type="secondary" size="medium">
                                Join Us
                            </AwesomeButton>
                        </Link>
                        <Link to="/register">
                            <AwesomeButton type="primary" size="medium">
                                Register
                            </AwesomeButton>
                        </Link>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-primary"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-md py-2 z-50">
                                <div className="px-4 py-2 text-gray-700 font-semibold">{user.displayName}</div>
                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
