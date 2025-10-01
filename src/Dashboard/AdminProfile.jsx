import { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AuthContext } from "../Components/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoadingSpinner from "../Components/LoadingSpinner";

const MySwal = withReactContent(Swal);

export default function AdminProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [adminData, setAdminData] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL;

    // 🔹 Fetch admin data from MongoDB
    useEffect(() => {
        if (!user?.email) return;

        const fetchAdmin = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/users?email=${user.email}`);
                if (res.data.success && res.data.data.length > 0) {
                    setAdminData(res.data.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [user, axiosSecure]);

    // 🔹 Handle tag submission with SweetAlert2
    const handleTagSubmit = async (e) => {
        e.preventDefault();
        if (!tags) return;

        try {
            await axiosSecure.post("/addtags", { tag: tags });
            MySwal.fire({
                icon: "success",
                title: `Tag "${tags}" added successfully!`,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: "top-right",
            });
            setTags("");
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "Failed to add tag",
                text: err.message || "Something went wrong",
            });
        }
    };

    if (loading)
        return (
            <LoadingSpinner></LoadingSpinner>
        );

    if (!adminData)
        return (
            <div className="text-center mt-10 text-gray-600">
                Admin data not found.
            </div>
        );

    return (
        <div className="space-y-6 p-6 max-w-3xl mx-auto">
            {/* Admin Info Card */}
            <div className="bg-white p-6 rounded shadow text-center opacity-0 animate-fadeIn cursor-pointer">
                <img
                    src={adminData.avatar || "https://via.placeholder.com/120"}
                    alt={adminData.fullName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold">{adminData.fullName}</h2>
                <p className="text-gray-500">{adminData.email}</p>
            </div>

            {/* Add Tag Form */}
            <div className="bg-white p-6 rounded shadow opacity-0 animate-slideUp">
                <h2 className="text-xl font-bold mb-4">Add New Tag</h2>
                <form onSubmit={handleTagSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter tag name"
                        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transform hover:scale-105 transition cursor-pointer"
                    >
                        Add Tag
                    </button>
                </form>
            </div>

            {/* Animations */}
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
