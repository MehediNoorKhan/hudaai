import React from "react";
import SocialLogin from "./SocialLogin";

const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <form className="space-y-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                    />

                    <button type="submit" className="btn btn-primary w-full">
                        Register
                    </button>
                </form>

                {/* Optional: Social Login buttons (static) */}
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Register;
