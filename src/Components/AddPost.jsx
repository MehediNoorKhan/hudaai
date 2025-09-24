// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import Swal from "sweetalert2";
// import imageCompression from "browser-image-compression";
// import { AuthContext } from "./AuthContext"; // <-- import your context

// const AddPost = () => {
//     const { user } = useContext(AuthContext); // ✅ get logged-in user

//     const [tags, setTags] = useState([]);
//     const [loadingTags, setLoadingTags] = useState(true);
//     const [uploading, setUploading] = useState(false);
//     const [imageUploaded, setImageUploaded] = useState(false);

//     const { register, handleSubmit, control, reset, setValue, watch } = useForm();
//     const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
//     const authorImage = watch("authorImage");

//     // Fetch tags from backend
//     useEffect(() => {
//         const fetchTags = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
//                 const formattedTags = res.data.map(tag => ({ value: tag.name, label: tag.name }));
//                 setTags(formattedTags);
//             } catch (err) {
//                 console.error("Failed to fetch tags:", err);
//             } finally {
//                 setLoadingTags(false);
//             }
//         };
//         fetchTags();
//     }, []);

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setUploading(true);
//         setImageUploaded(false);

//         try {
//             const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
//             const formData = new FormData();
//             formData.append("image", compressedFile);

//             const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
//             if (res.data.success) {
//                 setValue("authorImage", res.data.data.url);
//                 setImageUploaded(true);
//             } else {
//                 throw new Error("Image upload failed");
//             }
//         } catch (err) {
//             console.error(err);
//             Swal.fire({ icon: "error", title: "Image upload failed" });
//         } finally {
//             setUploading(false);
//         }
//     };

//     const onSubmit = async (data) => {
//         try {
//             const postData = {
//                 authorImage: data.authorImage,
//                 authorName: user.displayName,
//                 authorEmail: user.email,
//                 postTitle: data.postTitle,
//                 postDescription: data.postDescription,
//                 tag: data.tag.value,
//                 upVote: 0,
//                 downVote: 0,
//                 upvote_by: [],
//                 vote: 0,
//                 downvote_by: [],
//                 comments: [],
//                 creation_time: new Date(),
//             };

//             await axios.post(`${import.meta.env.VITE_API_URL}/posts`, postData);

//             Swal.fire({
//                 icon: "success",
//                 title: "Post added successfully",
//                 timer: 2000,
//                 showConfirmButton: false,
//             });

//             reset();
//             setImageUploaded(false);
//         } catch (err) {
//             console.error(err);
//             Swal.fire({ icon: "error", title: "Failed to add post" });
//         }
//     };

//     if (!user || loadingTags) return <p className="text-center mt-6">Loading...</p>;

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-purple-50 rounded shadow mt-6">
//             <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">Add New Post</h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <div>
//                     <label>Author Name</label>
//                     <input type="text" value={user.displayName} disabled className="w-full px-4 py-2 border rounded" />
//                 </div>
//                 <div>
//                     <label>Author Email</label>
//                     <input type="email" value={user.email} disabled className="w-full px-4 py-2 border rounded" />
//                 </div>
//                 <div>
//                     <label>Author Image</label>
//                     <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-4 py-2 border rounded" />
//                 </div>
//                 <input type="hidden" {...register("authorImage", { required: true })} />
//                 <div>
//                     <label>Post Title</label>
//                     <input type="text" {...register("postTitle", { required: true })} placeholder="Enter title" className="w-full px-4 py-2 border rounded" />
//                 </div>
//                 <div>
//                     <label>Post Description</label>
//                     <textarea {...register("postDescription", { required: true })} rows={4} placeholder="Enter description" className="w-full px-4 py-2 border rounded"></textarea>
//                 </div>
//                 <div>
//                     <label>Select Tag</label>
//                     <Controller
//                         name="tag"
//                         control={control}
//                         rules={{ required: true }}
//                         render={({ field }) => <Select {...field} options={tags} />}
//                     />
//                 </div>
//                 <button type="submit" disabled={!imageUploaded || uploading} className="px-6 py-2 bg-purple-500 text-white rounded">
//                     {uploading ? "Uploading..." : "Add Post"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddPost;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
import { AuthContext } from "./AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const AddPost = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);

    const { register, handleSubmit, control, reset, setValue, watch } = useForm();
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    const authorImage = watch("authorImage");

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await axiosSecure.get("/tags"); // use axiosSecure for protected backend
                const formattedTags = res.data.map(tag => ({ value: tag.name, label: tag.name }));
                setTags(formattedTags);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
    }, []);

    // Image upload handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setImageUploaded(false);

        try {
            const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
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
            Swal.fire({ icon: "error", title: "Image upload failed" });
        } finally {
            setUploading(false);
        }
    };

    // Submit handler
    const onSubmit = async (data) => {
        if (!user) return Swal.fire({ icon: "warning", title: "Login required" });

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

            await axiosSecure.post("/posts", postData); // send post via secure axios

            Swal.fire({
                icon: "success",
                title: "Post added successfully",
                timer: 2000,
                showConfirmButton: false,
            });

            reset();
            setImageUploaded(false);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Failed to add post" });
        }
    };

    if (!user || loadingTags) return <p className="text-center mt-6">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-purple-50 rounded shadow mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">Add New Post</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Author Name</label>
                    <input
                        type="text"
                        value={user.displayName}
                        disabled
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label>Author Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
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
                <div>
                    <label>Post Title</label>
                    <input
                        type="text"
                        {...register("postTitle", { required: true })}
                        placeholder="Enter title"
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div>
                    <label>Post Description</label>
                    <textarea
                        {...register("postDescription", { required: true })}
                        rows={4}
                        placeholder="Enter description"
                        className="w-full px-4 py-2 border rounded"
                    ></textarea>
                </div>
                <div>
                    <label>Select Tag</label>
                    <Controller
                        name="tag"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <Select {...field} options={tags} />}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!imageUploaded || uploading}
                    className="px-6 py-2 bg-purple-500 text-white rounded"
                >
                    {uploading ? "Uploading..." : "Add Post"}
                </button>
            </form>
        </div>
    );
};

export default AddPost;

