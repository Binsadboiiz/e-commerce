import Skeleton from './Skeleton';

/**
 * Universal Page Skeleton used during route transitions and lazy loading fallbacks.
 * Matches realistic page layout with header banner, filters, and cards.
 */
export default function PageSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
            {/* Top Breadcrumb & Title */}
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2.5">
                    <Skeleton width={180} height={28} borderRadius={8} />
                    <Skeleton width={320} height={16} borderRadius={6} />
                </div>
                <Skeleton width={120} height={38} borderRadius={8} />
            </div>

            {/* Hero / Banner Skeleton */}
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
                <Skeleton width="100%" height="100%" borderRadius={16} />
            </div>

            {/* Filter / Action Bar */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton width={100} height={36} borderRadius={8} />
                <Skeleton width={120} height={36} borderRadius={8} />
                <Skeleton width={90} height={36} borderRadius={8} />
                <div className="ml-auto">
                    <Skeleton width={160} height={36} borderRadius={8} />
                </div>
            </div>

            {/* Grid of Content Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-3">
                        <Skeleton width="100%" height={180} borderRadius={10} />
                        <Skeleton width="85%" height={18} borderRadius={6} />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton width={70} height={20} borderRadius={6} />
                            <Skeleton width={40} height={16} borderRadius={4} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
