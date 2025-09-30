import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import Swal from "sweetalert2";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function PostComments() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportedComments, setReportedComments] = useState(new Set());
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [page, setPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const limit = 5;

    const totalPages = Math.ceil(totalComments / limit);

    const feedbackOptions = [
        { value: "", label: "Select feedback" },
        { value: "inappropriate", label: "Inappropriate content" },
        { value: "spam", label: "Spam or repetitive content" },
        { value: "harassment", label: "Harassment or bullying" },
    ];

    const fetchComments = async (pageNumber = 1) => {
        if (!id || !axiosSecure) return;
        try {
            setLoading(true);
            setError(null);

            const response = await axiosSecure.get(`/posts/${id}/comments`, {
                params: { page: pageNumber, limit },
            });

            setPost(response.data.post || { postTitle: "Post Title" });
            setComments(response.data.comments || []);
            setTotalComments(response.data.totalComments || 0);

            // Check report status
            if (user && response.data.comments) {
                const reportStatuses = await Promise.all(
                    response.data.comments.map(async (comment) => {
                        try {
                            const statusRes = await axiosSecure.get(
                                `/comments/${comment._id}/report-status`
                            );
                            return {
                                commentId: comment._id,
                                hasReported: statusRes.data.hasReported,
                            };
                        } catch (err) {
                            return { commentId: comment._id, hasReported: false };
                        }
                    })
                );
                const reportedSet = new Set();
                reportStatuses.forEach((status) => {
                    if (status.hasReported) reportedSet.add(status.commentId);
                });
                setReportedComments(reportedSet);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(page);
    }, [page]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleFeedbackChange = (commentId, feedback) => {
        setSelectedFeedback((prev) => ({ ...prev, [commentId]: feedback }));
    };

    const handleReport = async (commentId) => {
        const feedback = selectedFeedback[commentId];
        if (!feedback) {
            Swal.fire({
                icon: "warning",
                title: "Select feedback",
                text: "Please select a feedback option before reporting.",
            });
            return;
        }

        try {
            const response = await axiosSecure.post(`/comments/${commentId}/report`, {
                feedback,
                postId: id,
            });

            if (response.data.success) {
                setReportedComments((prev) => new Set([...prev, commentId]));
                setSelectedFeedback((prev) => {
                    const updated = { ...prev };
                    delete updated[commentId];
                    return updated;
                });

                Swal.fire({
                    icon: "success",
                    title: "Reported!",
                    text: "Comment reported successfully.",
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to report comment. Please try again.",
            });
        }
    };

    if (loading)
        return (
            <LoadingSpinner></LoadingSpinner>
        );

    if (error)
        return (
            <div className="max-w-6xl mx-auto mt-6 p-6 bg-red-50 border border-red-200 rounded text-center">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-gray-50 rounded shadow">
            {/* Post Header */}
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{post.postTitle}</h1>
                <div className="text-sm text-gray-500">
                    {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
                </div>
            </div>

            {/* Comments Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-lg">
                    <thead className="bg-blue-200">
                        <tr>
                            <th className="p-3 text-left">Commenter</th>
                            <th className="p-3 text-left">Comment</th>
                            <th className="p-3 text-center">Feedback</th>
                            <th className="p-3 text-center">Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-gray-500">
                                    No comments yet
                                </td>
                            </tr>
                        ) : (
                            comments.map((c) => {
                                const isReported = reportedComments.has(c._id);
                                const selectedFeedbackForComment = selectedFeedback[c._id] || "";
                                const canReport = selectedFeedbackForComment && !isReported && user;

                                return (
                                    <tr
                                        key={c._id}
                                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        <td className="p-3 font-medium">{c.commenterEmail}</td>
                                        <td className="p-3">{c.comment}</td>
                                        <td className="p-3 text-center">
                                            <select
                                                value={selectedFeedbackForComment}
                                                onChange={(e) =>
                                                    handleFeedbackChange(c._id, e.target.value)
                                                }
                                                disabled={isReported || !user}
                                                className="p-2 border rounded text-sm disabled:bg-gray-100"
                                            >
                                                {feedbackOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3 text-center">
                                            <AwesomeButton
                                                type={isReported ? "disabled" : "primary"}
                                                disabled={!canReport}
                                                onPress={() => handleReport(c._id)}
                                                size="medium"
                                            >
                                                {isReported ? "Reported" : "Report"}
                                            </AwesomeButton>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded cursor-pointer ${page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
