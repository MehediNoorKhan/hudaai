export default function ManageUsersSkeleton() {
    return (
        <div className="p-6 animate-pulse">
            {/* Title */}
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>

            {/* Table header */}
            <div className="grid grid-cols-5 gap-4 mb-4">
                {Array(5)
                    .fill("")
                    .map((_, i) => (
                        <div key={i} className="h-5 bg-gray-200 rounded"></div>
                    ))}
            </div>

            {/* Table rows */}
            <div className="space-y-4">
                {Array(6)
                    .fill("")
                    .map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 gap-4">
                            {Array(5)
                                .fill("")
                                .map((_, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className="h-5 bg-gray-200 rounded"
                                    ></div>
                                ))}
                        </div>
                    ))}
            </div>
        </div>
    );
}
