import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import useAxiosSecure from "../Components/useAxiosSecure";
import LoadingSpinner from "../Components/LoadingSpinner";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminHome() {
    const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

    if (loading)
        return <LoadingSpinner />;

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            {/* Stats boxes with fade-in and scale animation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {["posts", "comments", "users"].map((key, index) => (
                    <div
                        key={key}
                        className="bg-white p-6 rounded shadow text-center transform transition-all duration-700 hover:scale-105 opacity-0 animate-fadeIn"
                        style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
                    >
                        <p className="text-gray-500 capitalize">{key}</p>
                        <p className="text-3xl font-bold">{stats[key]}</p>
                    </div>
                ))}
            </div>

            {/* Pie chart with fade-in */}
            <div
                className="bg-white p-6 rounded shadow max-w-md mx-auto opacity-0 animate-fadeIn"
                style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
                <Pie data={pieData} />
            </div>

            {/* Tailwind keyframes for animations */}
            <style>{`
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

  @keyframes slideUp {
    0% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slideUp { animation: slideUp 0.6s ease forwards; }
`}</style>

        </div>
    );
}
