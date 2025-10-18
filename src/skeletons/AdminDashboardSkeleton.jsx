export default function AdminDashboardSkeleton() {
    return (
        <div className="flex min-h-screen animate-pulse bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col gap-4">
                <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
                {Array(6)
                    .fill("")
                    .map((_, i) => (
                        <div key={i} className="h-6 w-full bg-gray-200 rounded"></div>
                    ))}
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 flex flex-col gap-6">
                {/* Topbar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>

                {/* Dashboard stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4)
                        .fill("")
                        .map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
                                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-8 w-full bg-gray-200 rounded"></div>
                            </div>
                        ))}
                </div>

                {/* Recent activity / charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart or table panel */}
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        <div className="h-6 w-40 bg-gray-200 rounded"></div>
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
                            ))}
                    </div>
                </div>

                {/* Latest posts / users */}
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                    {Array(6)
                        .fill("")
                        .map((_, i) => (
                            <div key={i} className="h-5 w-full bg-gray-200 rounded"></div>
                        ))}
                </div>
            </main>
        </div>
    );
}
