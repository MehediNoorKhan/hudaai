import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../Firebase.config.init";
import { useNavigate } from "react-router";

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate(); // hook for navigation

    const handleGoogleLogin = () => {
        googleLogin(auth)
            .then(async (result) => {
                const user = result.user;
                const additionalUserInfo = getAdditionalUserInfo(result);

                // Only save user in DB if first-time login
                if (additionalUserInfo.isNewUser) {
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
                        await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);

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
                        text: "You have logged in via Google",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }

                // Navigate to home page after login
                navigate("/");
            })
            .catch((error) => {
                console.error("Google login error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error.message,
                });
            });
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full mt-3"
        >
            Continue with Google
        </button>
    );
};

export default SocialLogin;
