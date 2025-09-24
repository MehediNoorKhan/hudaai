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
        <div className="flex flex-wrap gap-2 max-w-7xl mx-auto">
            {tags.map((tag, index) => {
                const colorClass = colors[index % colors.length];
                return (
                    <span
                        key={tag._id || tag.name}
                        className={`text-white px-3 py-1 rounded-full ${colorClass} text-sm`}
                    >
                        {tag.name}
                    </span>
                );
            })}
        </div>
    );
};

export default TagBadges;
