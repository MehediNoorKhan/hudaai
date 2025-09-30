import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { FaRegCalendarAlt, FaRegClock, FaThumbsUp, FaThumbsDown, FaRegCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import LoadingSpinner from "../Components/LoadingSpinner";
import FailedToLoad from "../Components/FailedToLoad";

export default function DashboardProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [aboutMeEdit, setAboutMeEdit] = useState(false);
    const [aboutMeText, setAboutMeText] = useState("");

    // Fetch profile
    useEffect(() => {
        if (!user?.email) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosSecure.get(`/users/profile`, { params: { email: user.email } });
                setProfile(res.data);
                setAboutMeText(res.data.aboutMe || "");
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, axiosSecure]);

    const handleAboutMeSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosSecure.put("/users/aboutme", { aboutMe: aboutMeText });
            if (res.data?.aboutMe !== undefined) {
                setProfile((prev) => ({ ...prev, aboutMe: res.data.aboutMe }));
                setAboutMeEdit(false);
                toast.success("About Me updated successfully!");
            } else toast.error("Failed to update About Me.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update About Me.");
        }
    };

    if (loading) return <LoadingSpinner></LoadingSpinner>;
    if (error) return <FailedToLoad></FailedToLoad>;
    if (!profile) return <p className="text-center mt-10 text-yellow-600">Profile not found</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-xl space-y-6">
            <ToastContainer position="top-right" autoClose={2000} />

            {/* User Info with animated avatar */}
            <div className="text-center">
                <motion.img
                    src={profile.avatar || "/default-avatar.png"}
                    alt={profile.fullName}
                    className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover shadow-md"
                    whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
                />
                <h2 className="text-3xl font-bold text-gray-800">{profile.fullName}</h2>
                <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>

            {/* About Me Section */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">About Me</h3>
                    {!aboutMeEdit && (
                        <button
                            onClick={() => setAboutMeEdit(true)}
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {aboutMeEdit ? (
                    <form onSubmit={handleAboutMeSave} className="flex flex-col gap-3">
                        <textarea
                            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={aboutMeText}
                            onChange={(e) => setAboutMeText(e.target.value)}
                            rows={4}
                        />
                        <div className="flex gap-3">
                            <AwesomeButton type="primary" size="medium" onPress={handleAboutMeSave} className="cursor-pointer">
                                Save
                            </AwesomeButton>
                            <AwesomeButton
                                type="secondary"
                                size="medium"
                                onPress={() => {
                                    setAboutMeEdit(false);
                                    setAboutMeText(profile.aboutMe || "");
                                }}
                                className="cursor-pointer"
                            >
                                Cancel
                            </AwesomeButton>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.aboutMe || "No About Me yet."}</p>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    className="bg-white p-5 rounded-lg text-center shadow hover:shadow-lg transition cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-3xl font-bold text-blue-600">
                        <CountUp end={profile.totalPostCount || 0} duration={1.5} />
                    </div>
                    <div className="text-gray-600 mt-1">Total Posts</div>
                </motion.div>

                <motion.div
                    className="bg-white p-5 rounded-lg text-center shadow hover:shadow-lg transition cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-3xl font-bold text-green-600">
                        <CountUp end={profile.posts || 0} duration={1.5} />
                    </div>
                    <div className="text-gray-600 mt-1">Posts Count</div>
                </motion.div>

                <motion.div
                    className="bg-white p-5 rounded-lg text-center shadow hover:shadow-lg transition cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="text-3xl font-bold text-purple-600">
                        <CountUp end={profile.user_status || 0} duration={1.5} />
                    </div>
                    <div className="text-gray-600 mt-1">Status</div>
                </motion.div>
            </div>

            {/* Recent Posts with slide-in animation */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Posts</h3>
                    {profile.totalPostCount > 3 && (
                        <span className="text-sm text-gray-500">Showing 3 of {profile.totalPostCount} posts</span>
                    )}
                </div>

                {profile.recentPosts && profile.recentPosts.length > 0 ? (
                    <div className="space-y-4">
                        {profile.recentPosts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">{post.postTitle || post.title}</h4>
                                    {post.tag && (
                                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 ml-2">
                                            {post.tag}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.postDescription || post.description}</p>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <FaRegCalendarAlt /> {new Date(post.creation_time).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaRegClock /> {new Date(post.creation_time).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <FaThumbsUp /> {post.upVote || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaThumbsDown /> {post.downVote || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaRegCommentDots /> {post.comments?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-blue-50 rounded-lg">
                        <div className="text-blue-200 text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">No posts found</p>
                        <p className="text-blue-300 text-sm">Start sharing your thoughts with the community!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
