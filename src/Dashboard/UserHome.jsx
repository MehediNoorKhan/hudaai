import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AuthContext } from "../Components/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function UserHome() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({ posts: 0, comments: 0, votes: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/users/home-stats?email=${user.email}`);
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch user stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, axiosSecure]);

    const barData = {
        labels: ["Posts", "Comments", "Total Votes"],
        datasets: [
            {
                label: "Your Stats",
                data: [stats.posts, stats.comments, stats.votes],
                backgroundColor: ["#4f46e5", "#16a34a", "#f59e0b"],
            },
        ],
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            {/* Stats Cards */}
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
                    <p className="text-gray-500">Total Votes</p>
                    <p className="text-3xl font-bold">{stats.votes}</p>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded shadow">
                <Bar data={barData} />
            </div>
        </div>
    );
}
