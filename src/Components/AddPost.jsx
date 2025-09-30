import React, { useContext, useState, useEffect } from "react";
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
import { useNavigate } from "react-router";

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [actualUserData, setActualUserData] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true);

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

    // 🔹 Fetch actual user data from MongoDB
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;
            try {
                setLoadingUserData(true);
                const res = await axiosSecure.get("/users"); // gets all users
                if (res.data.success && Array.isArray(res.data.data)) {
                    const matchedUser = res.data.data.find(u => u.email === user.email);
                    setActualUserData(matchedUser || null);
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            } finally {
                setLoadingUserData(false);
            }
        };

        fetchUserData();
    }, [user, axiosSecure]);

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

            toast.success("Post added successfully");
            reset();
            setImageUploaded(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add post");
        }
    };

    if (!user || loadingTags || loadingUserData) return <LoadingSpinner />;

    // 🔹 Check if the user is not a member and has >= 5 posts in MongoDB
    const hitLimit = actualUserData?.membership === "no" && actualUserData?.posts >= 5;

    if (hitLimit) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-purple-50 rounded shadow p-6 space-y-4">
                <h2 className="text-xl font-bold text-purple-600 text-center">
                    You have hit your limit of adding posts.
                </h2>
                <p className="text-center text-gray-700">
                    To add more posts, become a member.
                </p>
                <AwesomeButton
                    type="primary"
                    onPress={() => navigate("/membership")}
                >
                    Go to Membership
                </AwesomeButton>
            </div>
        );
    }

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
                    {uploading ? "Image Uploading..." : "Add Post"}
                </AwesomeButton>
            </form>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AddPost;
