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
import { motion } from "framer-motion";
import LoadingSpinner from "../Components/LoadingSpinner";

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
            <LoadingSpinner></LoadingSpinner>
        );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Posts", value: stats.posts },
                    { label: "Comments", value: stats.comments },
                    { label: "Total Votes", value: stats.votes },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white p-6 rounded shadow text-center"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                    >
                        <p className="text-gray-500">{stat.label}</p>
                        <motion.p
                            className="text-3xl font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.2 }}
                        >
                            {stat.value}
                        </motion.p>
                    </motion.div>
                ))}
            </div>

            {/* Bar Chart */}
            <motion.div
                className="bg-white p-6 rounded shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
                <Bar data={barData} />
            </motion.div>
        </div>
    );
}
