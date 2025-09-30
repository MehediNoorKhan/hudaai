import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../Firebase.config.init";
import { useNavigate } from "react-router";

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const uploadToImgbb = async (imageUrl) => {
        try {
            const formData = new FormData();
            formData.append("image", imageUrl);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            return res.data.data.display_url;
        } catch (err) {
            console.error("Image upload error:", err);
            return imageUrl; // fallback to original
        }
    };

    const handleGoogleLogin = () => {
        googleLogin(auth)
            .then(async (result) => {
                const user = result.user;
                const additionalUserInfo = getAdditionalUserInfo(result);

                // upload Google photoURL to imgbb
                let avatarUrl = user.photoURL;
                if (avatarUrl) {
                    avatarUrl = await uploadToImgbb(avatarUrl);
                }

                // Only save user in DB if first-time login
                if (additionalUserInfo.isNewUser) {
                    const userData = {
                        fullName: user.displayName,
                        email: user.email,
                        avatar: avatarUrl,
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

                // Navigate after login
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
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
            Continue with Google
        </button>
    );
};

export default SocialLogin;
