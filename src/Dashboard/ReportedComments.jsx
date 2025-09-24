import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";

export default function ReportedComments() {
    const axiosSecure = useAxiosSecure();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axiosSecure.get(`/reports?status=pending`);
            if (res.data.success) {
                const reportData = await Promise.all(
                    res.data.data.map(async (report) => {
                        // fetch comment info from comments table
                        const commentRes = await axiosSecure.get(`/comments/${report.commentId}`);
                        const commentData = commentRes.data?.data || {};
                        return {
                            ...report,
                            commenterName: commentData.commenterName,
                            commentText: commentData.comment,
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

    const handleDelete = async (report) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            // 1. Delete the comment from the comments table
            await axiosSecure.delete(`/comments/${report.commentId}`);

            // 2. Delete the report
            await axiosSecure.delete(`/reports/${report._id}`);

            // 3. Remove from UI
            setReports((prev) => prev.filter((r) => r._id !== report._id));
            alert("Comment and report deleted successfully.");
        } catch (err) {
            console.error("Failed to delete comment/report:", err);
            alert("Failed to delete comment/report.");
        }
    };

    if (loading) return <p className="text-center mt-6">Loading reported comments...</p>;
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
    if (!reports.length) return <p className="text-center mt-6">No reported comments found.</p>;

    return (
        <div className="max-w-6xl mx-auto mt-6 p-4 bg-white shadow rounded">
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
                        {reports.map((report) => (
                            <tr key={report._id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3">{report.commentText || "N/A"}</td>
                                <td className="border border-gray-200 p-3">{report.commenterName || "Unknown"}</td>
                                <td className="border border-gray-200 p-3">{report.reporterEmail}</td>
                                <td className="border border-gray-200 p-3">{report.feedback}</td>
                                <td className="border border-gray-200 p-3">{new Date(report.reportedAt).toLocaleString()}</td>
                                <td className="border border-gray-200 p-3 capitalize">{report.status}</td>
                                <td className="border border-gray-200 p-3">
                                    <button
                                        onClick={() => handleDelete(report)}
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
        </div>
    );
}
