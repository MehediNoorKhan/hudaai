import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Components/AuthContext";
import useAxiosSecure from "../Components/useAxiosSecure";

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

                const res = await axiosSecure.get(`/users/profile`, {
                    params: { email: user.email },
                });

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

    // Handle About Me save
    const handleAboutMeSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosSecure.put("/users/aboutme", { aboutMe: aboutMeText });

            if (res.data?.aboutMe !== undefined) {
                setProfile((prev) => ({ ...prev, aboutMe: res.data.aboutMe }));
                setAboutMeEdit(false);
                alert("About Me updated successfully!");
            } else {
                alert("Failed to update About Me.");
            }
        } catch (err) {
            console.error("Update About Me error:", err);
            alert("Failed to update About Me.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading profile...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
    if (!profile) return <p className="text-center mt-10 text-yellow-600">Profile not found</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded space-y-6">
            {/* User Info */}
            <div className="text-center">
                <img
                    src={profile.avatar || "/default-avatar.png"}
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300 object-cover"
                />
                <h2 className="text-3xl font-bold">{profile.fullName}</h2>
                <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>

            {/* About Me Section */}
            <div className="bg-gray-50 p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">About Me</h3>
                    {!aboutMeEdit && (
                        <button
                            onClick={() => setAboutMeEdit(true)}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {aboutMeEdit ? (
                    <form onSubmit={handleAboutMeSave} className="flex flex-col gap-2">
                        <textarea
                            className="border p-2 rounded w-full"
                            value={aboutMeText}
                            onChange={(e) => setAboutMeText(e.target.value)}
                            rows={4}
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAboutMeEdit(false);
                                    setAboutMeText(profile.aboutMe || "");
                                }}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{profile.aboutMe || "No About Me yet."}</p>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
