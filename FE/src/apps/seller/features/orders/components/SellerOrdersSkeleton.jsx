import Skeleton from "@/shared/components/ui/Skeleton";

export function SellerOrdersSkeleton({ rows = 6 }) {
    return (
        <div className="orders-table-wrapper" style={{ padding: "8px" }}>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            <td>
                                <Skeleton width={80} height={20} borderRadius={4} />
                            </td>
                            <td>
                                <div className="space-y-1.5 py-1">
                                    <Skeleton width={120} height={18} borderRadius={4} />
                                    <Skeleton width={100} height={14} borderRadius={4} />
                                </div>
                            </td>
                            <td>
                                <div className="space-y-1.5 py-1">
                                    <Skeleton width={160} height={18} borderRadius={4} />
                                    <Skeleton width={90} height={14} borderRadius={4} />
                                </div>
                            </td>
                            <td>
                                <Skeleton width={100} height={20} borderRadius={4} />
                            </td>
                            <td>
                                <Skeleton width={85} height={26} borderRadius={12} />
                            </td>
                            <td>
                                <Skeleton width={90} height={16} borderRadius={4} />
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <div className="flex justify-center gap-2">
                                    <Skeleton width={32} height={32} borderRadius={6} />
                                    <Skeleton width={32} height={32} borderRadius={6} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function SellerOrderDetailSkeleton() {
    return (
        <div style={{ padding: "20px" }} className="space-y-6">
            <div className="space-y-2">
                <Skeleton width={140} height={22} borderRadius={6} />
                <Skeleton width={220} height={16} borderRadius={4} />
            </div>

            <div className="border border-slate-100 rounded-xl p-4 space-y-4">
                <Skeleton width={120} height={18} borderRadius={4} />
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50">
                        <Skeleton width={48} height={48} borderRadius={8} />
                        <div className="flex-1 space-y-2">
                            <Skeleton width="60%" height={16} borderRadius={4} />
                            <Skeleton width="30%" height={14} borderRadius={4} />
                        </div>
                        <Skeleton width={80} height={18} borderRadius={4} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                    <Skeleton width={100} height={16} borderRadius={4} />
                    <Skeleton width="80%" height={16} borderRadius={4} />
                    <Skeleton width="60%" height={16} borderRadius={4} />
                </div>
                <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                    <Skeleton width={100} height={16} borderRadius={4} />
                    <Skeleton width="70%" height={16} borderRadius={4} />
                    <Skeleton width="50%" height={16} borderRadius={4} />
                </div>
            </div>
        </div>
    );
}
