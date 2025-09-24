import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";

export default function AddAnnouncement() {
    const { user, loading } = useContext(AuthContext);
    const { register, handleSubmit, setValue, reset } = useForm();
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const axiosSecure = useAxiosSecure();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/login"; // or navigate("/joinus") if using react-router
        }
    }, [user, loading]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setValue("authorImage", data.data.url);
                setImageUploaded(true);
            } else {
                throw new Error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Image upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (formData) => {
        if (!user?.email) {
            Swal.fire("Login required", "Please login to add an announcement", "warning");
            return;
        }

        try {
            const announcement = {
                authorName: formData.authorName,
                authorEmail: user.email,
                authorImage: formData.authorImage,
                title: formData.title,
                description: formData.description,
                creation_time: new Date(),
            };

            // ✅ Use Axios Secure for authenticated request
            const { data } = await axiosSecure.post("/announcements", announcement);

            Swal.fire("Success", "Announcement added successfully", "success");
            reset();
            setImageUploaded(false);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to add announcement", "error");
        }
    };

    if (loading) return <div className="text-center mt-10 text-white">Checking authentication...</div>;
    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto mt-6 p-6 rounded shadow bg-gradient-to-r from-pink-400 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Announcement</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Author Name */}
                <div>
                    <label>Author Name</label>
                    <input
                        type="text"
                        {...register("authorName", { required: true })}
                        placeholder="Enter author name"
                        className="w-full px-3 py-2 rounded text-black"
                    />
                </div>

                {/* Author Image */}
                <div>
                    <label>Author Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>

                {/* Hidden field to store uploaded image URL */}
                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Title */}
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        placeholder="Enter title"
                        className="w-full px-3 py-2 rounded text-black"
                    />
                </div>

                {/* Description */}
                <div>
                    <label>Description</label>
                    <textarea
                        {...register("description", { required: true })}
                        placeholder="Enter description"
                        rows={4}
                        className="w-full px-3 py-2 rounded text-black"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={uploading || !imageUploaded}
                    className={`px-6 py-2 rounded bg-purple-700 ${uploading || !imageUploaded ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    Add Announcement
                </button>
            </form>
        </div>
    );
}
