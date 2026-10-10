import Skeleton from "@/shared/components/ui/Skeleton";

export default function SellerVouchersSkeleton({ rows = 6 }) {
    return (
        <div className="vouchers-table-wrapper" style={{ padding: "8px" }}>
            <table className="vouchers-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Discount</th>
                        <th>Min Order</th>
                        <th>Usage</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            <td>
                                <Skeleton width={90} height={24} borderRadius={6} />
                            </td>
                            <td>
                                <Skeleton width={140} height={18} borderRadius={4} />
                            </td>
                            <td>
                                <Skeleton width={70} height={18} borderRadius={4} />
                            </td>
                            <td>
                                <Skeleton width={80} height={18} borderRadius={4} />
                            </td>
                            <td>
                                <Skeleton width={60} height={18} borderRadius={4} />
                            </td>
                            <td>
                                <div className="space-y-1">
                                    <Skeleton width={100} height={14} borderRadius={4} />
                                    <Skeleton width={100} height={14} borderRadius={4} />
                                </div>
                            </td>
                            <td>
                                <Skeleton width={70} height={24} borderRadius={12} />
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
