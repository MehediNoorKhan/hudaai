import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Announcements() {
    const fetchAnnouncements = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`);
        return data;
    };

    const { data: announcements = [], isLoading, isError } = useQuery({
        queryKey: ["announcements"],
        queryFn: fetchAnnouncements,
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    if (isLoading) return <p className="text-center mt-6">Loading announcements...</p>;
    if (isError) return <p className="text-center mt-6 text-red-500">Failed to load announcements.</p>;
    if (announcements.length === 0) return <p className="text-center mt-6"></p>;

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Announcements</h2>
            {announcements.map((a) => (
                <div key={a._id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src={a.authorImage || "/default-avatar.png"}
                            alt={a.authorName}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="font-semibold">{a.authorName}</p>
                            <p className="text-gray-500 text-sm">
                                {new Date(a.creation_time).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{a.title}</h3>
                    <p className="text-gray-700">{a.description}</p>
                </div>
            ))}
        </div>
    );
}



