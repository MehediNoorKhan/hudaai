import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import SocialLogin from "./SocialLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Logged in successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            setEmail("");
            setPassword("");
            navigate("/"); // redirect after login
        } catch (error) {
            toast.error(`Login failed: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            {/* Place ToastContainer once per page or app */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <SocialLogin />

                <p className="text-sm text-center text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
