import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { AuthContext } from "./AuthContext";
import { Bell } from "lucide-react";

const Header = () => {
    const { user, logOut } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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
        <div className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
            <div className="navbar max-w-7xl mx-auto">

                {/* Left - Logo + Name */}
                <div className="navbar-start">
                    <Link
                        to="/"
                        className="flex items-center gap-2 normal-case text-2xl hover:bg-transparent"
                    >
                        <span className="font-bold text-primary">Convonest</span>
                    </Link>
                </div>

                {/* Center - Navigation (md and above) */}
                <div className="navbar-center hidden md:flex gap-6 items-center">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Membership", path: "/membership" },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-2 py-1 font-medium text-gray-500 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#3689E3] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ${isActive(link.path) ? "after:scale-x-100 text-[#3689E3]" : ""
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right - Buttons / Profile */}
                <div className="navbar-end flex items-center gap-3">

                    {/* Notification Bell */}
                    {user && (
                        <div className="relative mr-4 cursor-pointer text-gray-500">
                            <Bell size={24} />
                            {announcementCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {announcementCount}
                                </span>
                            )}
                        </div>
                    )}

                    {!user ? (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <button className="btn btn-soft btn-primary">Join Us</button>
                            </Link>
                            <Link to="/register" className="hidden md:block">
                                <button className="btn btn-outline btn-primary">Register</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-[#3689E3]"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
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
        </div>
    );
};

export default Header;
