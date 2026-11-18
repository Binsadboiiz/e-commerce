import Skeleton from "@/shared/components/ui/Skeleton";
import styles from "../pages/SellerDashboard.module.css";

export default function SellerDashboardSkeleton() {
    return (
        <div className={styles.container}>
            {/* Header section */}
            <header className={styles.header}>
                <div className="space-y-2">
                    <Skeleton width={220} height={32} borderRadius={8} />
                    <Skeleton width={360} height={16} borderRadius={6} />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton width={140} height={38} borderRadius={8} />
                    <Skeleton width={100} height={38} borderRadius={8} />
                </div>
            </header>

            {/* KPI Cards */}
            <section className={styles.statsGrid}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statCardHeader}>
                            <Skeleton width={130} height={16} borderRadius={4} />
                            <Skeleton width={36} height={36} borderRadius={8} />
                        </div>
                        <div className={styles.statBody}>
                            <Skeleton width={110} height={28} borderRadius={6} />
                            <div className="flex items-center gap-2 mt-2">
                                <Skeleton width={50} height={16} borderRadius={4} />
                                <Skeleton width={80} height={14} borderRadius={4} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton width={180} height={22} borderRadius={6} />
                        <Skeleton width={100} height={28} borderRadius={6} />
                    </div>
                    <Skeleton width="100%" height={260} borderRadius={12} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <Skeleton width={160} height={22} borderRadius={6} />
                    <div className="flex justify-center py-4">
                        <Skeleton width={180} height={180} borderRadius="50%" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton width="100%" height={16} borderRadius={4} />
                        <Skeleton width="80%" height={16} borderRadius={4} />
                    </div>
                </div>
            </section>

            {/* Orders Table Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton width={160} height={22} borderRadius={6} />
                    <Skeleton width={200} height={36} borderRadius={8} />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50">
                            <Skeleton width={90} height={18} borderRadius={4} />
                            <Skeleton width={140} height={18} borderRadius={4} />
                            <Skeleton width={100} height={18} borderRadius={4} />
                            <Skeleton width={80} height={24} borderRadius={12} />
                            <Skeleton width={70} height={30} borderRadius={6} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
