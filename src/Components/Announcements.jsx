import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import FailedToLoad from "./FailedToLoad";

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

    if (isLoading) return <LoadingSpinner></LoadingSpinner>;
    if (isError) return <FailedToLoad></FailedToLoad>;
    if (announcements.length === 0) return <p className="text-center mt-6"></p>;

    return (
        <div className="max-w-4xl mx-auto my-6 py-4 space-y-6">
            <h2 className="text-4xl font-bold text-center text-purple-500 mb-8 mt-4">Announcements</h2>
            {announcements.map((a) => (
                <div key={a._id} className="bg-green-50 rounded-lg shadow-md p-4">
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



