import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import useAxiosSecure from "../Components/useAxiosSecure";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminHome() {
    const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    // Fetch stats from backend
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"; // set in .env

    useEffect(() => {
        async function fetchStats() {
            try {
                const postsRes = await axios.get(`${API_BASE}/api/posts/count`);
                const commentsRes = await axios.get(`${API_BASE}/api/comments/count`);
                const usersRes = await axios.get(`${API_BASE}/api/users/count`);

                setStats({
                    posts: postsRes.data.count,
                    comments: commentsRes.data.count,
                    users: usersRes.data.count,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);


    // Handle tag submission
    const handleTagSubmit = async (e) => {
        e.preventDefault();
        if (!tags) return;
        try {
            await axiosSecure.post("/addtags", { tag: tags });
            alert(`Tag "${tags}" added successfully!`);
            setTags("");
        } catch (err) {
            console.error(err);
            alert("Failed to add tag.");
        }
    };

    const pieData = {
        labels: ["Posts", "Comments", "Users"],
        datasets: [
            {
                label: "Site Stats",
                data: [stats.posts, stats.comments, stats.users],
                backgroundColor: ["#4f46e5", "#16a34a", "#dc2626"],
                borderColor: ["#fff", "#fff", "#fff"],
                borderWidth: 1,
            },
        ],
    };

    if (loading) return <p className="text-center mt-10">Loading stats...</p>;

    return (
        <div className="space-y-6">
            {/* Stats boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow text-center">
                    <p className="text-gray-500">Posts</p>
                    <p className="text-3xl font-bold">{stats.posts}</p>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                    <p className="text-gray-500">Comments</p>
                    <p className="text-3xl font-bold">{stats.comments}</p>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                    <p className="text-gray-500">Users</p>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>
            </div>

            {/* Pie chart */}
            <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                <Pie data={pieData} />
            </div>

            {/* Add Tag Form */}
            <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Add New Tag</h2>
                <form onSubmit={handleTagSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter tag name"
                        className="border px-3 py-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Tag
                    </button>
                </form>
            </div>
        </div>
    );
}
