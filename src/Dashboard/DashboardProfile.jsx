import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";

export default function DashboardProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchProfile = async () => {
            try {
                const res = await axiosSecure.get(`/users/profile?email=${user.email}`);
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, axiosSecure]);

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>User not found</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
            {/* User Info */}
            <div className="text-center mb-6">
                <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-gray-300"
                />
                <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
                <p className="text-gray-600">{profile.email}</p>
                <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {profile.user_status}
                </span>
            </div>

            {/* Recent Posts */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Recent Posts</h3>
                {profile.recentPosts?.length > 0 ? (
                    <ul className="space-y-3">
                        {profile.recentPosts.map((post) => (
                            <li
                                key={post._id}
                                className="p-4 border rounded shadow-sm hover:shadow-md transition"
                            >
                                <h4 className="font-medium">{post.postTitle}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {post.postDescription}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(post.creation_time).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No posts found.</p>
                )}
            </div>
        </div>
    );
}
