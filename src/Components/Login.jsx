import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosSecure from "./axiosSecure"; // use the instance, not a function

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
            const userCredential = await login(email, password);
            const user = userCredential.user;

            const res = await axiosSecure.post("/jwt", { email: user.email });
            const token = res.data.token;

            if (token) {
                localStorage.setItem("access-token", token);

                toast.success("Logged in successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setEmail("");
                setPassword("");
                navigate("/");
            }
        } catch (error) {
            toast.error(`Login failed: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <ToastContainer />
            <div className="w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="input input-primary w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="input input-primary w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Google Login Button */}
                <button className="btn bg-white text-black border-[#e5e5e5] w-full flex items-center justify-center gap-2 mt-2">
                    <svg
                        aria-label="Google logo"
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <g>
                            <path d="m0 0H512V512H0" fill="#fff"></path>
                            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                        </g>
                    </svg>
                    Login with Google
                </button>

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
