import React from "react";
import { Link } from "react-router";
import SocialLogin from "./SocialLogin";

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-base-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                {/* Login Form */}
                <form className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-4 font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600 transition"
                    >
                        Login
                    </button>
                </form>

                {/* Social Login */}
                <SocialLogin />

                {/* Link to Register */}
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
