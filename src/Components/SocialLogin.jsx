import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import axiosSecure from "./axiosSecure"; // Axios instance with JWT support
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await googleLogin();
            const user = result.user;

            // Save user to backend if first-time login
            const isNewUser = result._tokenResponse?.isNewUser;

            if (isNewUser) {
                const userData = {
                    fullName: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    uid: user.uid,
                    role: "user",
                    user_status: "Bronze",
                    membership: "no",
                    posts: 0,
                };

                try {
                    await axiosSecure.post("/users", userData);
                    Swal.fire({
                        icon: "success",
                        title: "Welcome!",
                        text: "Registered via Google successfully",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error("DB Error:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Database Error",
                        text: "Could not save user info",
                    });
                    return;
                }
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Welcome back!",
                    text: "Logged in via Google",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            // 🔹 Request JWT after login
            const jwtRes = await axiosSecure.post("/jwt", { email: user.email });
            const token = jwtRes.data.token;

            if (token) {
                localStorage.setItem("access-token", token);
            }

            navigate("/"); // redirect to home
        } catch (error) {
            console.error("Google login error:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message,
            });
        }
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mt-2"
        >
            Continue with Google
        </button>
    );
};

export default SocialLogin;
