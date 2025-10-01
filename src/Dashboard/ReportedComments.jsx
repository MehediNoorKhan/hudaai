import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import LoadingSpinner from "../Components/LoadingSpinner";
import FailedToLoad from "../Components/FailedToLoad";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ReportedComments() {
    const axiosSecure = useAxiosSecure();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reported comments
    const fetchReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axiosSecure.get("/reports?status=pending");

            if (res.data.success) {
                const reportData = await Promise.all(
                    res.data.data.map(async (report) => {
                        let commentData = {};
                        try {
                            const commentRes = await axiosSecure.get(`/comments/${report.commentId}`);
                            commentData = commentRes.data?.data || {};
                        } catch (err) {
                            console.warn(`Failed to fetch comment ${report.commentId}:`, err);
                        }

                        return {
                            ...report,
                            commenterName: commentData.commenterName || "Unknown",
                            commentText: commentData.comment || "N/A",
                            status: report.status || "pending",
                            feedback: report.feedback || "-",
                            reporterEmail: report.reporterEmail || "Unknown",
                        };
                    })
                );

                setReports(reportData);
            } else {
                setError("Failed to fetch reports");
            }
        } catch (err) {
            console.error("Error fetching reports:", err);
            setError("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Delete a comment/report
    const handleDelete = async (report) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "This will delete the comment and the report!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/comments/${report.commentId}`);
            await axiosSecure.delete(`/reports/${report._id}`);
            setReports((prev) => prev.filter((r) => r._id !== report._id));
            MySwal.fire("Deleted!", "Comment and report deleted successfully.", "success");
        } catch (err) {
            console.error("Failed to delete comment/report:", err);
            MySwal.fire("Error!", "Failed to delete comment/report.", "error");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <FailedToLoad message={error} />;
    if (!reports.length)
        return <p className="text-center mt-6 text-gray-500">No reported comments found.</p>;

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Reported Comments</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-3 text-left">Comment</th>
                            <th className="border border-gray-200 p-3 text-left">Commenter</th>
                            <th className="border border-gray-200 p-3 text-left">Reported By</th>
                            <th className="border border-gray-200 p-3 text-left">Feedback</th>
                            <th className="border border-gray-200 p-3 text-left">Reported At</th>
                            <th className="border border-gray-200 p-3 text-left">Status</th>
                            <th className="border border-gray-200 p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr
                                key={report._id}
                                className="hover:bg-gray-50 transform transition-all duration-500 opacity-0 animate-fadeIn"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                            >
                                <td className="border border-gray-200 p-3">{report.commentText}</td>
                                <td className="border border-gray-200 p-3">{report.commenterName}</td>
                                <td className="border border-gray-200 p-3">{report.reporterEmail}</td>
                                <td className="border border-gray-200 p-3">{report.feedback}</td>
                                <td className="border border-gray-200 p-3">
                                    {report.reportedAt ? new Date(report.reportedAt).toLocaleString() : "N/A"}
                                </td>
                                <td className="border border-gray-200 p-3 capitalize">{report.status}</td>
                                <td className="border border-gray-200 p-3">
                                    <button
                                        onClick={() => handleDelete(report)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 cursor-pointer transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
      `}</style>
        </div>
    );
}
