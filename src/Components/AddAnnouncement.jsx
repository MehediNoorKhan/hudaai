import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import LoadingSpinner from "./LoadingSpinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

export default function AddAnnouncement() {
    const { user, loading } = useContext(AuthContext);
    const { register, handleSubmit, setValue, reset, watch } = useForm();
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const authorImage = watch("authorImage");

    // Mutation for adding announcement
    const addAnnouncementMutation = useMutation({
        mutationFn: async (announcement) => {
            const { data } = await axiosSecure.post("/announcements", announcement);
            return data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Announcement added successfully",
                timer: 2000,
                showConfirmButton: false,
            });
            reset();
            setImageUploaded(false);
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add announcement",
            });
        },
    });

    // Image upload handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setImageUploaded(false);

        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                { method: "POST", body: formData }
            );

            const data = await res.json();
            if (data.success) {
                setValue("authorImage", data.data.url);
                setImageUploaded(true);
            } else {
                throw new Error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Image upload failed",
            });
        } finally {
            setUploading(false);
        }
    };

    // Form submission
    const onSubmit = async (formData) => {
        if (!user?.email) {
            Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "Please login to add an announcement",
            });
            return;
        }

        const announcement = {
            authorName: formData.authorName,
            authorEmail: user.email,
            authorImage: formData.authorImage,
            title: formData.title,
            description: formData.description,
            creation_time: new Date(),
        };

        addAnnouncementMutation.mutate(announcement);
    };

    if (loading) return <LoadingSpinner />;
    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-8 p-8 rounded-xl shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-slideUp">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg animate-fadeIn">
                    Add Announcement
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Author Name */}
                    <div>
                        <label className="block text-white font-semibold mb-2 text-lg">
                            Author Name
                        </label>
                        <input
                            type="text"
                            {...register("authorName", { required: true })}
                            placeholder="Enter author name"
                            className="w-full px-4 py-3 rounded-lg text-gray-800 bg-white border-2 border-transparent focus:border-yellow-300 focus:outline-none transition cursor-pointer"
                        />
                    </div>

                    {/* Author Image */}
                    <div>
                        <label className="block text-white font-semibold mb-2 text-lg">
                            Author Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-3 rounded-lg text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-purple-600 file:font-semibold hover:file:bg-gray-100 transition"
                        />
                    </div>

                    <input type="hidden" {...register("authorImage", { required: true })} />

                    {/* Title */}
                    <div>
                        <label className="block text-white font-semibold mb-2 text-lg">
                            Announcement Title
                        </label>
                        <input
                            type="text"
                            {...register("title", { required: true })}
                            placeholder="Enter announcement title"
                            className="w-full px-4 py-3 rounded-lg text-gray-800 bg-white border-2 border-transparent focus:border-yellow-300 focus:outline-none transition cursor-pointer"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white font-semibold mb-2 text-lg">
                            Description
                        </label>
                        <textarea
                            {...register("description", { required: true })}
                            placeholder="Enter announcement description"
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg text-gray-800 bg-white border-2 border-transparent focus:border-yellow-300 focus:outline-none transition resize-none cursor-pointer"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <AwesomeButton
                            type="primary"
                            size="large"
                            disabled={uploading || !imageUploaded || addAnnouncementMutation.isLoading}
                            className="cursor-pointer"
                        >
                            {addAnnouncementMutation.isLoading
                                ? "Adding..."
                                : uploading
                                    ? "Uploading Image..."
                                    : "Add Announcement"}
                        </AwesomeButton>
                    </div>
                </form>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

                @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp { animation: slideUp 0.6s ease forwards; }
            `}</style>
        </div>
    );
}
