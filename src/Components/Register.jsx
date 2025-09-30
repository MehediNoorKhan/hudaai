import React, { useState, useContext } from "react";
import axios from "axios";
import SocialLogin from "./SocialLogin";
import { AuthContext } from "./AuthContext"; // AuthProvider
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            Swal.fire({
                icon: "warning",
                title: "Please select an image!",
            });
            return;
        }

        setLoading(true);

        // Upload image to ImgBB
        const formData = new FormData();
        formData.append("image", image);
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

        axios
            .post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData)
            .then((res) => {
                const imageUrl = res.data.data.url;

                // Create user in Firebase
                createUser(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Immediately sign out so the user is not logged in automatically
                        auth.signOut();

                        // Update Firebase profile (optional, you can still update)
                        updateUserProfile(fullName, imageUrl)
                            .then(() => {
                                const userData = {
                                    fullName,
                                    email,
                                    avatar: imageUrl,
                                    uid: user.uid,
                                    role: "user",
                                    user_status: "Bronze",
                                    membership: "no",
                                    posts: 0,
                                };

                                // Save user in your DB
                                axios
                                    .post(`${import.meta.env.VITE_API_URL}/users`, userData)
                                    .then(() => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Registered Successfully!",
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });

                                        setFullName("");
                                        setEmail("");
                                        setPassword("");
                                        setImage(null);
                                    });
                            });
                    })
                    .catch((error) => {
                        console.error("Firebase error:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Firebase Error",
                            text: error.message,
                        });
                    });
            })
            .catch((error) => {
                console.error("ImgBB error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Image Upload Failed",
                    text: error.message,
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-bordered w-full"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        onChange={handleImageChange}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <SocialLogin />
            </div>
        </div>
    );
};

export default Register;
