import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TagBadges = () => {
    const colors = [
        "bg-red-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-teal-500",
    ];

    // Fetch tags with TanStack Query
    const { data: tags = [], isLoading, isError } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    if (isLoading) return <p className="text-center mt-4">Loading tags...</p>;
    if (isError) return <p className="text-center mt-4 text-red-500">Failed to load tags</p>;

    return (
        <div>
            <h3 className="text-center text-4xl font-bold text-gray-600 py-8">Choose a Tag to search</h3>
            <div className="flex flex-row gap-6 max-w-xl flex-wrap mx-auto p-4 justify-center items-center">
                {tags.map((tag, index) => {
                    const colorClass = colors[index % colors.length];
                    return (
                        <span
                            key={tag._id || tag.name}
                            className={`text-white px-4 py-2 rounded-3xl ${colorClass} text-md text-center`}
                        >
                            {tag.name}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default TagBadges;
