import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Banner() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState(""); // Only set when search button is clicked
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        setLoading(true);
        setSearchedTerm(trimmed); // ✅ Only update when search is submitted

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/posts/search`,
                { tag: trimmed }
            );
            setResults(data.posts || []);
        } catch (err) {
            console.error("Search error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white">
            {/* Banner Content */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold">Welcome to ConvoNest</h1>
                <p className="text-lg">Search posts by tag to find what you’re interested in.</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex justify-center mt-4 gap-2">
                    <input
                        type="text"
                        placeholder="Search by tag..."
                        className="px-4 py-2 rounded-l text-black w-1/2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-white text-purple-600 font-bold rounded-r hover:bg-gray-100"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Search Results */}
            <div className="max-w-4xl mx-auto mt-6">
                {loading && <p className="text-white">Loading...</p>}

                {/* Show this only after search button is clicked */}
                {!loading && results.length === 0 && searchedTerm && (
                    <p className="text-white text-center">
                        No posts found for "{searchedTerm}"
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {results.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white text-black p-4 rounded shadow cursor-pointer hover:shadow-lg"
                            onClick={() => navigate(`/postdetails/${post._id}`)}
                        >
                            <h3 className="font-bold text-lg mb-2">{post.postTitle}</h3>
                            <p className="text-sm mb-2">{post.postDescription}</p>
                            <p className="text-xs text-gray-500">#{post.tag}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
