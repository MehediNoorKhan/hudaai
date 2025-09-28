// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../Components/AuthContext";
// import useAxiosSecure from "../Components/useAxiosSecure";

// export default function MyPosts() {
//     const { user } = useContext(AuthContext);
//     const axiosSecure = useAxiosSecure();
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!user?.email || !axiosSecure) return;

//         const fetchPosts = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const res = await axiosSecure.get(`/myposts/${user.email}`);

//                 if (res.data.success) {
//                     setPosts(res.data.data);
//                 } else {
//                     setError("Failed to fetch posts");
//                 }
//             } catch (err) {
//                 console.error("Error fetching posts:", err);
//                 setError("Error loading posts. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPosts();
//     }, [user, axiosSecure]);

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const deletePost = async (postId) => {
//         if (!window.confirm('Are you sure you want to delete this post?')) {
//             return;
//         }

//         try {
//             await axiosSecure.delete(`/posts/${postId}`);
//             setPosts(posts.filter(post => post._id !== postId));
//             alert('Post deleted successfully');
//         } catch (err) {
//             console.error('Error deleting post:', err);
//             alert('Failed to delete post');
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-64">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="text-gray-600 mt-2">Loading your posts...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="max-w-4xl mx-auto mt-6 p-6 bg-red-50 border border-red-200 rounded">
//                 <p className="text-red-800 text-center">{error}</p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="bg-red-600 text-white px-4 py-2 rounded mt-4 mx-auto block hover:bg-red-700"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     if (!posts.length) {
//         return (
//             <div className="max-w-4xl mx-auto mt-6 p-8 bg-white shadow rounded text-center">
//                 <h2 className="text-2xl font-bold mb-4">My Posts</h2>
//                 <div className="text-gray-500">
//                     <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <p className="text-lg">No posts found</p>
//                     <p className="text-sm mt-2">You haven't created any posts yet.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded">
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold">My Posts</h2>
//                     <p className="text-gray-600">{posts.length} posts found</p>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                     Signed in as: {user?.email}
//                 </div>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-200">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border border-gray-200 p-3 text-left">Post Title</th>
//                             <th className="border border-gray-200 p-3 text-center">Number of Votes</th>
//                             <th className="border border-gray-200 p-3 text-center">Comment</th>
//                             <th className="border border-gray-200 p-3 text-center">Delete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {posts.map((post) => (
//                             <tr key={post._id} className="hover:bg-gray-50">
//                                 <td className="border border-gray-200 p-3">
//                                     <h3 className="font-semibold text-gray-900">
//                                         {post.postTitle}
//                                     </h3>
//                                 </td>
//                                 <td className="border border-gray-200 p-3 text-center">
//                                     <span className="font-medium text-lg">
//                                         {(post.upVote || 0) - (post.downVote || 0)}
//                                     </span>
//                                 </td>
//                                 <td className="border border-gray-200 p-3 text-center">
//                                     <button
//                                         onClick={() => window.location.href = `/dashboard/posts/${post._id}`}
//                                         className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
//                                     >
//                                         Comment
//                                     </button>
//                                 </td>
//                                 <td className="border border-gray-200 p-3 text-center">
//                                     <button
//                                         onClick={() => deletePost(post._id)}
//                                         className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-4 text-sm text-gray-500 text-center">
//                 Showing all {posts.length} of your posts
//             </div>
//         </div>
//     );
// }


import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";

export default function MyPosts() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.email || !axiosSecure) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosSecure.get(`/myposts/${user.email}`);

                if (res.data.success) {
                    setPosts(res.data.data);
                } else {
                    setError("Failed to fetch posts");
                }
            } catch (err) {
                console.error("Error fetching posts:", err);

                // Handle different error types
                if (err.response?.status === 403) {
                    setError("Access denied. You can only view your own posts.");
                } else if (err.response?.status === 401) {
                    setError("Please log in to access your posts.");
                } else {
                    setError("Error loading posts. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, axiosSecure]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const deletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await axiosSecure.delete(`/posts/${postId}`);
            setPosts(posts.filter(post => post._id !== postId));
            alert('Post deleted successfully');
        } catch (err) {
            console.error('Error deleting post:', err);
            if (err.response?.status === 403) {
                alert('Access denied. You can only delete your own posts.');
            } else {
                alert('Failed to delete post');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading your posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-6 p-6 bg-red-50 border border-red-200 rounded">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!posts.length) {
        return (
            <div className="max-w-4xl mx-auto mt-6 p-8 bg-white shadow rounded text-center">
                <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                <div className="text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">No posts found</p>
                    <p className="text-sm mt-2">You haven't created any posts yet.</p>
                    <button
                        onClick={() => window.location.href = '/dashboard/addpost'}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Your First Post
                    </button>
                </div>
            </div>
        );
    }

    // Rest of your existing component JSX remains the same...
    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">My Posts</h2>
                    <p className="text-gray-600">{posts.length} posts found</p>
                </div>
                <div className="text-sm text-gray-500">
                    Signed in as: {user?.email}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-3 text-left">Post Title</th>
                            <th className="border border-gray-200 p-3 text-center">Number of Votes</th>
                            <th className="border border-gray-200 p-3 text-center">Comment</th>
                            <th className="border border-gray-200 p-3 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3">
                                    <h3 className="font-semibold text-gray-900">
                                        {post.postTitle}
                                    </h3>
                                </td>
                                <td className="border border-gray-200 p-3 text-center">
                                    <span className="font-medium text-lg">
                                        {(post.upVote || 0) - (post.downVote || 0)}
                                    </span>
                                </td>
                                <td className="border border-gray-200 p-3 text-center">
                                    <button
                                        onClick={() => window.location.href = `/dashboard/posts/${post._id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Comment
                                    </button>
                                </td>
                                <td className="border border-gray-200 p-3 text-center">
                                    <button
                                        onClick={() => deletePost(post._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
                Showing all {posts.length} of your posts
            </div>
        </div>
    );
}