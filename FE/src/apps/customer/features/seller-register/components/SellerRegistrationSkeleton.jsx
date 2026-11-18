import Skeleton from "@/shared/components/ui/Skeleton";
import styles from "../pages/SellerRegistrationPage.module.css";

export default function SellerRegistrationSkeleton() {
    return (
        <div className={styles.container}>
            {/* Header / Stepper Skeleton */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8 space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton width={220} height={28} borderRadius={8} />
                    <Skeleton width={90} height={24} borderRadius={12} />
                </div>
                {/* Stepper bubbles */}
                <div className="grid grid-cols-4 gap-4 py-2">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <Skeleton width={36} height={36} borderRadius="50%" />
                            <Skeleton width={80} height={14} borderRadius={4} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content Skeleton */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                    <Skeleton width={180} height={22} borderRadius={6} />
                    <Skeleton width={320} height={16} borderRadius={4} />
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((field) => (
                        <div key={field} className="space-y-2">
                            <Skeleton width={120} height={16} borderRadius={4} />
                            <Skeleton width="100%" height={44} borderRadius={8} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <Skeleton width={100} height={40} borderRadius={8} />
                    <Skeleton width={120} height={40} borderRadius={8} />
                </div>
            </div>
        </div>
    );
}
