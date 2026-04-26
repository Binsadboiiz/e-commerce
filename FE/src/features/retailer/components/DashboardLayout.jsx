/**
 * <summary>
 * Retailer dashboard layout — tái sử dụng DashboardLayout chung.
 * Layout sẽ tự detect role qua AuthContext và render navigation phù hợp.
 * </summary>
 */
import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout"

export const RetailerDashboardLayout = () => {
    return (
        <DashboardLayout />
    )
}