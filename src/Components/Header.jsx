import { Link } from "react-router";
import logo from '../assets/convonest.PNG';

const Header = () => {
    return (
        <div className="navbar bg-base-100 shadow-md px-6">
            {/* Left - Logo + Name */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2 btn btn-ghost normal-case text-xl">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    CONVONEST
                </Link>
            </div>

            {/* Center - Navigation */}
            <div className="navbar-center hidden md:flex gap-6 items-center">
                <Link to="/">Home</Link>
                <Link to="/membership">Membership</Link>
            </div>

            {/* Right - Buttons */}
            <div className="navbar-end gap-3">
                <Link to="/login" className="btn btn-outline btn-primary">Join Us</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
        </div>
    );
};

export default Header;
