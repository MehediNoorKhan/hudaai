import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);

    const { register, handleSubmit, control, reset, setValue, watch } = useForm();
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    const authorImage = watch("authorImage");

    // 🔹 Fetch tags using TanStack Query
    const { data: tags = [], isLoading: loadingTags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tags");
            return res.data.map((tag) => ({ value: tag.name, label: tag.name }));
        },
    });

    // 🔹 Image upload handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setImageUploaded(false);

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
            });
            const formData = new FormData();
            formData.append("image", compressedFile);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData
            );

            if (res.data.success) {
                setValue("authorImage", res.data.data.url);
                setImageUploaded(true);

            } else {
                throw new Error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // 🔹 Submit handler
    const onSubmit = async (data) => {
        if (!user) {
            toast.warn("Login required to add a post");
            return;
        }

        try {
            const postData = {
                authorImage: data.authorImage,
                authorName: user.displayName,
                authorEmail: user.email,
                postTitle: data.postTitle,
                postDescription: data.postDescription,
                tag: data.tag.value,
                upVote: 0,
                downVote: 0,
                upvote_by: [],
                vote: 0,
                downvote_by: [],
                comments: [],
                creation_time: new Date(),
            };

            await axiosSecure.post("/posts", postData);

            toast.success("Post added successfully 🎉");
            reset();
            setImageUploaded(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add post");
        }
    };

    if (!user || loadingTags) return <LoadingSpinner />;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-purple-50 rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">
                Add New Post
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Author Name */}
                <div>
                    <label>Author Name</label>
                    <input
                        type="text"
                        value={user.displayName}
                        disabled
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                {/* Author Email */}
                <div>
                    <label>Author Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                {/* Author Image */}
                <div>
                    <label>Author Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <input type="hidden" {...register("authorImage", { required: true })} />

                {/* Post Title */}
                <div>
                    <label>Post Title</label>
                    <input
                        type="text"
                        {...register("postTitle", { required: true })}
                        placeholder="Enter title"
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                {/* Post Description */}
                <div>
                    <label>Post Description</label>
                    <textarea
                        {...register("postDescription", { required: true })}
                        rows={4}
                        placeholder="Enter description"
                        className="w-full px-4 py-2 border rounded"
                    ></textarea>
                </div>

                {/* Tags */}
                <div>
                    <label>Select Tag</label>
                    <Controller
                        name="tag"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={tags}
                                menuPortalTarget={null}
                                menuPosition="fixed"
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 50,
                                    }),
                                }}
                            />
                        )}
                    />

                </div>

                {/* Submit Button */}
                <AwesomeButton
                    type="primary"
                    disabled={!imageUploaded || uploading}
                    className="w-full"
                >
                    {uploading ? "Uploading..." : "Add Post"}
                </AwesomeButton>
            </form>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AddPost;
