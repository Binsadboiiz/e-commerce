import Skeleton from "@/shared/components/ui/Skeleton";
import styles from "../features/applications/pages/AdminSellerApplications.module.css";

export function AdminTableSkeleton({ rows = 6 }) {
    return (
        <div className={styles.container}>
            <div className="mb-6 space-y-2">
                <Skeleton width={260} height={32} borderRadius={8} />
                <Skeleton width={380} height={16} borderRadius={6} />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Representative</th>
                        <th>Company / License</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            <td>
                                <div className="space-y-1.5 py-1">
                                    <Skeleton width={140} height={18} borderRadius={4} />
                                    <Skeleton width={180} height={14} borderRadius={4} />
                                </div>
                            </td>
                            <td>
                                <div className="space-y-1.5 py-1">
                                    <Skeleton width={160} height={18} borderRadius={4} />
                                    <Skeleton width={110} height={14} borderRadius={4} />
                                </div>
                            </td>
                            <td>
                                <Skeleton width={80} height={24} borderRadius={6} />
                            </td>
                            <td>
                                <Skeleton width={90} height={26} borderRadius={12} />
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <div className="flex justify-center gap-2">
                                    <Skeleton width={70} height={32} borderRadius={6} />
                                    <Skeleton width={70} height={32} borderRadius={6} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function AdminDetailModalSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-3">
                <Skeleton width={120} height={20} borderRadius={6} />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton width="100%" height={36} borderRadius={6} />
                    <Skeleton width="100%" height={36} borderRadius={6} />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton width={140} height={20} borderRadius={6} />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton width="100%" height={36} borderRadius={6} />
                    <Skeleton width="100%" height={36} borderRadius={6} />
                    <Skeleton width="100%" height={36} borderRadius={6} />
                    <Skeleton width="100%" height={36} borderRadius={6} />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton width={160} height={20} borderRadius={6} />
                <Skeleton width="100%" height={80} borderRadius={8} />
            </div>
        </div>
    );
}
