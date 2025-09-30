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
            className="btn w-full bg-white text-black border-[#e5e5e5] flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
            {/* Google SVG */}
            <svg
                aria-label="Google logo"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                        fill="#34a853"
                        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                        fill="#4285f4"
                        d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                        fill="#fbbc02"
                        d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                        fill="#ea4335"
                        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                </g>
            </svg>
            Login with Google
        </button>
    );
};

export default SocialLogin;
