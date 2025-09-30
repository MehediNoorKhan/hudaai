import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import LoadingSpinner from "../Components/LoadingSpinner";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";

export default function Banner() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const searchMutation = useMutation({
        mutationFn: async (tag) => {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/posts/search`,
                { tag }
            );
            return data.posts || [];
        },
        onSuccess: (data) => setResults(data),
        onError: () => setResults([]),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;
        setSearchedTerm(trimmed);
        searchMutation.mutate(trimmed);
    };

    // Dummy handlers (replace with real vote logic)
    const handleVote = (id, type) => {
        console.log(`Voted ${type} on post ${id}`);
    };

    return (
        <div className="w-full p-6 bg-[#F9F1EC] text-gray-800">
            {/* Banner Content */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Welcome to ConvoNest</h1>
                <p className="text-lg text-gray-700">
                    Search posts by tag to find what you’re interested in.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex justify-center mt-4 gap-2">
                    <input
                        type="text"
                        placeholder="Search by tag..."
                        className="px-4 py-2 rounded-l text-black w-1/2 border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AwesomeButton
                        type="primary"
                        className="rounded-r"
                        style={{
                            "--button-primary-color": "#3b82f6",
                            "--button-primary-color-dark": "#1d4ed8",
                            "--button-primary-color-hover": "#2563eb",
                            "--button-primary-color-active": "#1e40af",
                            "--button-primary-border": "none",
                        }}
                    >
                        Search
                    </AwesomeButton>
                </form>
            </div>

            {/* Search Results */}
            <div className="max-w-7xl mx-auto mt-6">
                {searchMutation.isLoading && (
                    <div className="flex justify-center">
                        <LoadingSpinner />
                    </div>
                )}

                {!searchMutation.isLoading &&
                    results.length === 0 &&
                    searchedTerm && (
                        <p className="text-gray-600 text-center">
                            No posts found for "{searchedTerm}"
                        </p>
                    )}

                <div className="flex flex-row justify-center items-center flex-wrap gap-6 mt-4">
                    {results.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition w-[300px] h-[300px] flex flex-col justify-between"
                            onClick={(e) => {
                                if (
                                    e.target.closest(".vote-btn") ||
                                    e.target.closest(".comment-btn")
                                )
                                    return;
                                navigate(`/postdetails/${post._id}`);
                            }}
                        >
                            {/* Top content */}
                            <div>
                                {/* Author Info */}
                                <div className="flex items-center mb-3">
                                    <img
                                        src={post.authorImage || "/default-avatar.png"}
                                        alt={post.authorName || "Unknown"}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold">{post.authorName || "Unknown"}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(post.creation_time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <h3 className="text-lg font-bold mb-2">{post.postTitle || ""}</h3>
                                <p className="text-gray-700 mb-3">{post.postDescription || ""}</p>
                                <p className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-3">
                                    #{post.tag || ""}
                                </p>
                            </div>

                            {/* Bottom actions */}
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={() => handleVote(post._id, "upvote")}
                                    className="vote-btn flex items-center gap-1 text-gray-600 hover:text-green-600 transition"
                                >
                                    <FaThumbsUp /> {post.upVote}
                                </button>
                                <button
                                    onClick={() => handleVote(post._id, "downvote")}
                                    className="vote-btn flex items-center gap-1 text-gray-600 hover:text-red-600 transition"
                                >
                                    <FaThumbsDown /> {post.downVote}
                                </button>
                                <button
                                    onClick={() => navigate(`/postdetails/${post._id}`)}
                                    className="comment-btn flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
                                >
                                    <FaComment /> {post.comments?.length || 0}
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
