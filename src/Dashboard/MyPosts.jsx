import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { FaTrash, FaCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoadingSpinner from "../Components/LoadingSpinner";
import FailedToLoad from "../Components/FailedToLoad";

const MySwal = withReactContent(Swal);

export default function MyPosts() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        if (!user?.email || !axiosSecure) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosSecure.get(`/myposts/${user.email}`);
                if (res.data.success) setPosts(res.data.data || []);
                else setError("Failed to fetch posts");
            } catch (err) {
                console.error("Error fetching posts:", err);
                if (err.response?.status === 403) setError("Access denied.");
                else if (err.response?.status === 401) setError("Login required.");
                else setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, axiosSecure]);

    const deletePost = async (postId) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/posts/${postId}`);
                setPosts(posts.filter((post) => post._id !== postId));
                MySwal.fire("Deleted!", "Your post has been deleted.", "success");
            } catch (err) {
                console.error(err);
                MySwal.fire("Error!", "Failed to delete post.", "error");
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <FailedToLoad />;
    if (!posts.length)
        return (
            <div className="max-w-4xl mx-auto mt-6 p-8 bg-white shadow rounded text-center">
                <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                <p className="text-gray-500 text-lg">No posts found</p>
                <AwesomeButton
                    type="primary"
                    className="mt-4 cursor-pointer"
                    onPress={() => (window.location.href = "/dashboard/addpost")}
                >
                    Create Post
                </AwesomeButton>
            </div>
        );

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-gray-50 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">My Posts</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-center">Votes</th>
                            <th className="p-3 text-center">Comment</th>
                            <th className="p-3 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post, index) => {
                            const safeTitle = post.postTitle || "Untitled Post"; // Prevent null
                            const votes = (post.upVote || 0) - (post.downVote || 0);

                            return (
                                <tr key={post._id || index} className="hover:bg-blue-50 transition">
                                    <td className="p-3 font-semibold text-gray-900">{safeTitle}</td>
                                    <td className="p-3 text-center font-medium">{votes}</td>
                                    <td className="p-3 text-center">
                                        <AwesomeButton
                                            type="primary"
                                            size="small"
                                            onPress={() =>
                                                (window.location.href = `/dashboard/posts/${post._id}`)
                                            }
                                        >
                                            <FaCommentDots className="mr-1" /> Comment
                                        </AwesomeButton>
                                    </td>
                                    <td className="p-3 text-center">
                                        <AwesomeButton
                                            type="danger"
                                            size="small"
                                            onPress={() => deletePost(post._id)}
                                        >
                                            <FaTrash className="mr-1" /> Delete
                                        </AwesomeButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-blue-300"
                            } cursor-pointer`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
