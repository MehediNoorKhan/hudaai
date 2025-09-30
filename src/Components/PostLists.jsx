
// import React, { useContext } from "react";
// import { useNavigate } from "react-router";
// import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
// import Swal from "sweetalert2";
// import axios from "axios"; // For public requests
// import useAxiosSecure from "./useAxiosSecure"; // For protected requests
// import { AuthContext } from "./AuthContext";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const fetchPosts = async ({ queryKey }) => {
//     const [_key, { popularity, page }] = queryKey;
//     const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
//         params: {
//             sort: popularity ? "popularity" : undefined,
//             page,
//             limit: 5,
//         },
//     });

//     return {
//         posts: (res.data.posts || []).map((p) => ({
//             ...p,
//             upVote: p.upVote ?? 0,
//             downVote: p.downVote ?? 0,
//             comments: p.comments || [],
//             upvote_by: p.upvote_by || [],
//             downvote_by: p.downvote_by || [],
//         })),
//         totalPages: res.data.totalPages || 1,
//         currentPage: res.data.currentPage || 1,
//     };
// };

// const PostLists = () => {
//     const { user } = useContext(AuthContext);
//     const axiosSecure = useAxiosSecure();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     const [sortByPopularity, setSortByPopularity] = React.useState(false);
//     const [currentPage, setCurrentPage] = React.useState(1);

//     // Fetch posts
//     const { data, isLoading } = useQuery({
//         queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
//         queryFn: fetchPosts,
//         keepPreviousData: true,
//     });

//     // Mutation for upvote/downvote
//     const voteMutation = useMutation({
//         mutationFn: async ({ postId, type }) => {
//             return axiosSecure.post(`/posts/${postId}/vote`, { type });
//         },
//         onMutate: async ({ postId, type }) => {
//             await queryClient.cancelQueries({
//                 queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
//             });

//             const previousData = queryClient.getQueryData([
//                 "posts",
//                 { popularity: sortByPopularity, page: currentPage },
//             ]);

//             queryClient.setQueryData(
//                 ["posts", { popularity: sortByPopularity, page: currentPage }],
//                 (oldData) => {
//                     if (!oldData) return oldData;
//                     const updatedPosts = oldData.posts.map((p) => {
//                         if (p._id !== postId) return p;

//                         let upVote = p.upVote ?? 0;
//                         let downVote = p.downVote ?? 0;
//                         let upvote_by = p.upvote_by ?? [];
//                         let downvote_by = p.downvote_by ?? [];

//                         if (type === "upvote") {
//                             if (upvote_by.includes(user._id)) {
//                                 upVote -= 1;
//                                 upvote_by = upvote_by.filter((id) => id !== user._id);
//                             } else {
//                                 upVote += 1;
//                                 upvote_by = [...upvote_by, user._id];
//                                 if (downvote_by.includes(user._id)) {
//                                     downVote -= 1;
//                                     downvote_by = downvote_by.filter((id) => id !== user._id);
//                                 }
//                             }
//                         } else if (type === "downvote") {
//                             if (downvote_by.includes(user._id)) {
//                                 downVote -= 1;
//                                 downvote_by = downvote_by.filter((id) => id !== user._id);
//                             } else {
//                                 downVote += 1;
//                                 downvote_by = [...downvote_by, user._id];
//                                 if (upvote_by.includes(user._id)) {
//                                     upVote -= 1;
//                                     upvote_by = upvote_by.filter((id) => id !== user._id);
//                                 }
//                             }
//                         }

//                         return { ...p, upVote, downVote, upvote_by, downvote_by };
//                     });
//                     return { ...oldData, posts: updatedPosts };
//                 }
//             );

//             return { previousData };
//         },
//         onError: (err, variables, context) => {
//             Swal.fire({ icon: "error", title: "Failed to vote" });
//             if (context?.previousData) {
//                 queryClient.setQueryData(
//                     ["posts", { popularity: sortByPopularity, page: currentPage }],
//                     context.previousData
//                 );
//             }
//         },
//         onSettled: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
//             });
//         },
//     });

//     const handleVote = (postId, type) => {
//         if (!user) {
//             Swal.fire({ icon: "warning", title: "Please login to vote" });
//             return;
//         }
//         voteMutation.mutate({ postId, type });
//     };

//     if (isLoading) return <p className="text-center mt-6">Loading posts...</p>;
//     if (!data || data.posts.length === 0) return <p className="text-center mt-6">No posts found</p>;

//     return (
//         <div className="pt-4">
//             <div className="flex justify-between items-center px-6 mb-4">
//                 <h3 className="text-3xl font-bold">Posts</h3>
//                 <button
//                     onClick={() => setSortByPopularity((prev) => !prev)}
//                     className="px-4 py-2 bg-purple-500 text-white rounded"
//                 >
//                     {sortByPopularity ? "Show Latest" : "Sort by Popularity"}
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//                 {data.posts.map((post) => (
//                     <div
//                         key={post._id}
//                         className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition"
//                         onClick={(e) => {
//                             if (e.target.closest(".vote-btn") || e.target.closest(".comment-btn")) return;
//                             navigate(`/postdetails/${post._id}`);
//                         }}
//                     >
//                         <div className="flex items-center mb-3">
//                             <img
//                                 src={post.authorImage || undefined}
//                                 alt={post.authorName || "Unknown"}
//                                 className="w-10 h-10 rounded-full mr-3"
//                             />
//                             <div>
//                                 <p className="font-semibold">{post.authorName || "Unknown"}</p>
//                                 <p className="text-gray-500 text-sm">
//                                     {new Date(post.creation_time).toLocaleString()}
//                                 </p>
//                             </div>
//                         </div>

//                         <h3 className="text-lg font-bold mb-2">{post.postTitle || ""}</h3>
//                         <p className="text-gray-700 mb-3">{post.postDescription || ""}</p>
//                         <p className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-3">
//                             #{post.tag || ""}
//                         </p>

//                         <div className="flex items-center gap-4 mt-2">
//                             <button
//                                 onClick={() => handleVote(post._id, "upvote")}
//                                 className="vote-btn flex items-center gap-1 text-green-600"
//                             >
//                                 <FaThumbsUp /> {post.upVote}
//                             </button>
//                             <button
//                                 onClick={() => handleVote(post._id, "downvote")}
//                                 className="vote-btn flex items-center gap-1 text-red-600"
//                             >
//                                 <FaThumbsDown /> {post.downVote}
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/postdetails/${post._id}`)}
//                                 className="comment-btn flex items-center gap-1 text-gray-500"
//                             >
//                                 <FaComment /> {post.comments.length}
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-2 mt-6">
//                 <button
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                     Prev
//                 </button>
//                 <span>
//                     Page {currentPage} of {data.totalPages}
//                 </span>
//                 <button
//                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.totalPages))}
//                     disabled={currentPage === data.totalPages}
//                     className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PostLists;


import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPosts = async ({ queryKey }) => {
    const [_key, { popularity, page }] = queryKey;
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params: {
            sort: popularity ? "popularity" : undefined,
            page,
            limit: 5,
        },
    });

    return {
        posts: (res.data.posts || []).map((p) => ({
            ...p,
            upVote: p.upVote ?? 0,
            downVote: p.downVote ?? 0,
            comments: p.comments || [],
            upvote_by: p.upvote_by || [],
            downvote_by: p.downvote_by || [],
        })),
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
    };
};

const PostLists = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [sortByPopularity, setSortByPopularity] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Fetch posts
    const { data, isLoading } = useQuery({
        queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
        queryFn: fetchPosts,
        keepPreviousData: true,
    });

    // Mutation for upvote/downvote
    const voteMutation = useMutation({
        mutationFn: async ({ postId, type }) => {
            return axiosSecure.post(`/posts/${postId}/vote`, { type });
        },
        // Update the onMutate function in your frontend
        onMutate: async ({ postId, type }) => {
            await queryClient.cancelQueries({
                queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
            });

            const previousData = queryClient.getQueryData([
                "posts",
                { popularity: sortByPopularity, page: currentPage },
            ]);

            queryClient.setQueryData(
                ["posts", { popularity: sortByPopularity, page: currentPage }],
                (oldData) => {
                    if (!oldData) return oldData;
                    const updatedPosts = oldData.posts.map((p) => {
                        if (p._id !== postId) return p;

                        let upVote = p.upVote ?? 0;
                        let downVote = p.downVote ?? 0;
                        let upvote_by = p.upvote_by ?? [];
                        let downvote_by = p.downvote_by ?? [];

                        // Use email as identifier (match with backend)
                        const userIdentifier = user.email?.toLowerCase() || user._id?.toString() || user.id?.toString();

                        if (type === "upvote") {
                            if (upvote_by.includes(userIdentifier)) {
                                upVote -= 1;
                                upvote_by = upvote_by.filter((id) => id !== userIdentifier);
                            } else {
                                upVote += 1;
                                upvote_by = [...upvote_by, userIdentifier];

                                if (downvote_by.includes(userIdentifier)) {
                                    downVote -= 1;
                                    downvote_by = downvote_by.filter((id) => id !== userIdentifier);
                                }
                            }
                        } else if (type === "downvote") {
                            if (downvote_by.includes(userIdentifier)) {
                                downVote -= 1;
                                downvote_by = downvote_by.filter((id) => id !== userIdentifier);
                            } else {
                                downVote += 1;
                                downvote_by = [...downvote_by, userIdentifier];

                                if (upvote_by.includes(userIdentifier)) {
                                    upVote -= 1;
                                    upvote_by = upvote_by.filter((id) => id !== userIdentifier);
                                }
                            }
                        }

                        return { ...p, upVote, downVote, upvote_by, downvote_by };
                    });
                    return { ...oldData, posts: updatedPosts };
                }
            );

            return { previousData };
        },
        onError: (err, variables, context) => {
            Swal.fire({ icon: "error", title: "Failed to vote" });
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["posts", { popularity: sortByPopularity, page: currentPage }],
                    context.previousData
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts", { popularity: sortByPopularity, page: currentPage }],
            });
        },
    });

    const handleVote = (postId, type) => {
        if (!user) {
            Swal.fire({ icon: "warning", title: "Please login to vote" });
            return;
        }
        voteMutation.mutate({ postId, type });
    };

    if (isLoading) return <p className="text-center mt-6">Loading posts...</p>;
    if (!data || data.posts.length === 0) return <p className="text-center mt-6">No posts found</p>;

    return (
        <div className="pt-4">
            <div className="flex justify-between items-center px-6 mb-4">
                <h3 className="text-3xl font-bold">Posts</h3>
                <button
                    onClick={() => {
                        setSortByPopularity((prev) => !prev);
                        setCurrentPage(1); // Reset to page 1 when sorting changes
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                    {sortByPopularity ? "Show Latest" : "Sort by Popularity"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {data.posts.map((post) => {
                    const userId = user?._id || user?.id;
                    const hasUpvoted = post.upvote_by?.includes(userId);
                    const hasDownvoted = post.downvote_by?.includes(userId);

                    return (
                        <div
                            key={post._id}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition"
                            onClick={(e) => {
                                if (e.target.closest(".vote-btn") || e.target.closest(".comment-btn")) return;
                                navigate(`/postdetails/${post._id}`);
                            }}
                        >
                            <div className="flex items-center mb-3">
                                <img
                                    src={post.authorImage || "/default-avatar.png"}
                                    alt={post.authorName || "Unknown"}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                                <div>
                                    <p className="font-semibold">{post.authorName || "Unknown"}</p>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(post.creation_time).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-2">{post.postTitle || ""}</h3>
                            <p className="text-gray-700 mb-3">{post.postDescription || ""}</p>
                            <p className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-3">
                                #{post.tag || ""}
                            </p>

                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={() => handleVote(post._id, "upvote")}
                                    className={`vote-btn flex items-center gap-1 ${hasUpvoted ? "text-green-600 font-bold" : "text-gray-600"
                                        } hover:text-green-600 transition`}
                                >
                                    <FaThumbsUp /> {post.upVote}
                                </button>
                                <button
                                    onClick={() => handleVote(post._id, "downvote")}
                                    className={`vote-btn flex items-center gap-1 ${hasDownvoted ? "text-red-600 font-bold" : "text-gray-600"
                                        } hover:text-red-600 transition`}
                                >
                                    <FaThumbsDown /> {post.downVote}
                                </button>
                                <button
                                    onClick={() => navigate(`/postdetails/${post._id}`)}
                                    className="comment-btn flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
                                >
                                    <FaComment /> {post.comments.length}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6 pb-6">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Prev
                </button>
                <span className="px-4">
                    Page {currentPage} of {data.totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.totalPages))}
                    disabled={currentPage === data.totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PostLists;