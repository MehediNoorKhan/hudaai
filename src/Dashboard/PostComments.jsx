import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";

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

    // Static feedback options
    const feedbackOptions = [
        { value: "", label: "Select feedback" },
        { value: "inappropriate", label: "Inappropriate content" },
        { value: "spam", label: "Spam or repetitive content" },
        { value: "harassment", label: "Harassment or bullying" }
    ];

    useEffect(() => {
        if (!id || !axiosSecure) return;

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the post details
                const response = await axiosSecure.get(`/posts/${id}`);
                setPost(response.data);
                setComments(response.data.comments || []);

                // Check report status for each comment
                if (user && response.data.comments) {
                    const reportStatuses = await Promise.all(
                        response.data.comments.map(async (comment) => {
                            try {
                                const statusRes = await axiosSecure.get(`/comments/${comment._id}/report-status`);
                                return {
                                    commentId: comment._id,
                                    hasReported: statusRes.data.hasReported
                                };
                            } catch (err) {
                                console.error("Error checking report status:", err);
                                return { commentId: comment._id, hasReported: false };
                            }
                        })
                    );

                    const reportedSet = new Set();
                    reportStatuses.forEach(status => {
                        if (status.hasReported) {
                            reportedSet.add(status.commentId);
                        }
                    });
                    setReportedComments(reportedSet);
                }

            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Error loading post. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, axiosSecure, user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFeedbackChange = (commentId, feedback) => {
        setSelectedFeedback(prev => ({
            ...prev,
            [commentId]: feedback
        }));
    };

    const handleReport = async (commentId) => {
        const feedback = selectedFeedback[commentId];

        if (!feedback) {
            alert("Please select a feedback option before reporting.");
            return;
        }

        try {
            const response = await axiosSecure.post(`/comments/${commentId}/report`, {
                feedback,
                postId: id
            });

            if (response.data.success) {
                // Add to reported comments set
                setReportedComments(prev => new Set([...prev, commentId]));

                // Clear the feedback selection
                setSelectedFeedback(prev => {
                    const updated = { ...prev };
                    delete updated[commentId];
                    return updated;
                });

                alert("Comment reported successfully. Thank you for your feedback.");
            }
        } catch (err) {
            console.error("Error reporting comment:", err);
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to report comment. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading post and comments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto mt-6 p-6 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 text-center">{error}</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/myposts')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to My Posts
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded text-center">
                <p className="text-gray-600">Post not found</p>
                <button
                    onClick={() => navigate('/dashboard/myposts')}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                >
                    Back to My Posts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow rounded">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/dashboard/myposts')}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Posts
                </button>
                <h1 className="text-2xl font-bold">Post Comments</h1>
                <div></div>
            </div>

            {/* Post Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{post.postTitle}</h2>
                        <p className="text-gray-600 text-sm mt-1">by {post.authorName} • {formatDate(post.creation_time)}</p>
                        {post.tag && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2 inline-block">
                                {post.tag}
                            </span>
                        )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div>↑ {post.upVote || 0} upvotes</div>
                        <div>↓ {post.downVote || 0} downvotes</div>
                        <div>{comments.length} comments</div>
                    </div>
                </div>
            </div>

            {/* Comments Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-3 text-left">Commenter Email</th>
                            <th className="border border-gray-200 p-3 text-left">Comment</th>
                            <th className="border border-gray-200 p-3 text-center">Feedback</th>
                            <th className="border border-gray-200 p-3 text-center">Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="border border-gray-200 p-8 text-center text-gray-500">
                                    <div>
                                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.899 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9.899-8s9.901 3.582 9.901 8z" />
                                        </svg>
                                        <p className="text-lg">No comments yet</p>
                                        <p className="text-sm">This post doesn't have any comments.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment, index) => {
                                const isReported = reportedComments.has(comment._id);
                                const selectedFeedbackForComment = selectedFeedback[comment._id] || "";
                                const canReport = selectedFeedbackForComment && !isReported && user;

                                return (
                                    <tr key={comment._id || index} className="hover:bg-gray-50">
                                        <td className="border border-gray-200 p-3">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">
                                                    {comment.commenterEmail}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(comment.createdAt)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border border-gray-200 p-3">
                                            <p className="text-gray-700 break-words">
                                                {comment.comment}
                                            </p>
                                        </td>
                                        <td className="border border-gray-200 p-3 text-center">
                                            <select
                                                value={selectedFeedbackForComment}
                                                onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                                                disabled={isReported || !user}
                                                className="w-full p-2 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                {feedbackOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="border border-gray-200 p-3 text-center">
                                            <button
                                                onClick={() => handleReport(comment._id)}
                                                disabled={!canReport}
                                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${isReported
                                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                    : canReport
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {isReported ? 'Reported' : 'Report'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 text-sm text-gray-500 text-center">
                {comments.length > 0 ? (
                    `Showing all ${comments.length} comments for this post`
                ) : (
                    "No comments to display"
                )}
                {!user && (
                    <div className="mt-2 text-orange-600">
                        Please log in to report comments
                    </div>
                )}
            </div>
        </div>
    );
}