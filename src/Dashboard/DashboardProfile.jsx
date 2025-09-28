// Simplified DashboardProfile Component (remove role checking since UserRoute handles it)
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";

export default function DashboardProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        console.log(user.email);

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axiosSecure.get(`/users/profile?email=${user.email}`);
                console.log("Profile data:", res.data);
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response?.status === 403) {
                    setError("Access denied. Only users with 'user' role can access this page.");
                } else if (err.response?.status === 401) {
                    setError("Please log in to access this page.");
                } else {
                    setError("Failed to load profile data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, axiosSecure]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-600">User profile not found</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
            {/* User Info */}
            <div className="text-center mb-8">
                <img
                    src={profile.avatar || '/default-avatar.png'}
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300 object-cover"
                />
                <h2 className="text-3xl font-bold text-gray-800">{profile.fullName}</h2>
                <p className="text-gray-600 mt-1">{profile.email}</p>

                <div className="flex justify-center gap-4 mt-4">
                    <span className="inline-block px-4 py-2 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                        {profile.user_status}
                    </span>
                    {profile.role && (
                        <span className="inline-block px-4 py-2 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                            {profile.role}
                        </span>
                    )}
                    {profile.membership && profile.membership !== 'no' && (
                        <span className="inline-block px-4 py-2 text-sm rounded-full bg-purple-100 text-purple-800 font-medium">
                            {profile.membership} Member
                        </span>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {profile.totalPostCount || 0}
                    </div>
                    <div className="text-gray-600">Total Posts</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {profile.posts || 0}
                    </div>
                    <div className="text-gray-600">Posts Count</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {profile.user_status}
                    </div>
                    <div className="text-gray-600">Status</div>
                </div>
            </div>

            {/* Recent Posts */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Posts</h3>
                    {profile.totalPostCount > 3 && (
                        <span className="text-sm text-gray-500">
                            Showing 3 of {profile.totalPostCount} posts
                        </span>
                    )}
                </div>

                {profile.recentPosts && profile.recentPosts.length > 0 ? (
                    <div className="space-y-4">
                        {profile.recentPosts.map((post) => (
                            <div
                                key={post._id}
                                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                        {post.postTitle || post.title}
                                    </h4>
                                    {post.tag && (
                                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 ml-2">
                                            {post.tag}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {post.postDescription || post.description}
                                </p>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span>
                                            📅 {new Date(post.creation_time).toLocaleDateString()}
                                        </span>
                                        <span>
                                            ⏰ {new Date(post.creation_time).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            👍 {post.upVote || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            👎 {post.downVote || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {post.comments?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">No posts found</p>
                        <p className="text-gray-400 text-sm">Start sharing your thoughts with the community!</p>
                    </div>
                )}
            </div>
        </div>
    );
}