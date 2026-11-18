import React from "react";
import SEOHead from "@/shared/components/SEOHead";
import { AdminTableSkeleton } from "@/apps/admin/components/AdminTableSkeleton";
import { useSellerApplications } from "../hooks/useSellerApplications";
import ApplicationStatusTabs from "../components/ApplicationStatusTabs";
import ApplicationFilters from "../components/ApplicationFilters";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationDetailPage from "../components/ApplicationDetailPage";
import ApplicationDecisionDialog from "../components/ApplicationDecisionDialog";
import Button from "@/shared/components/ui/Button";
import styles from "./AdminSellerApplications.module.css";

/**
 * AdminSellerApplicationsPage Component
 * Main coordinator page for reviewing and processing seller registration applications.
 * Refactored into modular, testable components following Flat Section Layout.
 */
export const AdminSellerApplicationsPage = () => {
    const {
        loading,
        error,
        fetchApplications,

        // Tabs & Filters
        activeTab,
        setActiveTab,
        tabCounts,
        searchQuery,
        setSearchQuery,

        // Pagination & Data
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        paginatedApplications,

        // Detail Modal
        selectedDetail,
        detailLoading,
        handleViewDetail,
        handleCloseDetail,

        // Decision Dialog
        decisionDialog,
        decisionSubmitting,
        openStartReviewDialog,
        openApproveDialog,
        openRejectDialog,
        closeDecisionDialog,
        confirmStartReview,
        confirmApprove,
        confirmReject
    } = useSellerApplications();

    return (
        <div className={styles.container}>
            <SEOHead
                title="Seller Applications Management | Admin Portal"
                robots="noindex, nofollow"
                description="Review and manage seller onboarding registration requests."
            />

            <h1 className={styles.title}>Seller Applications</h1>
            <p className={styles.subtitle}>
                Review and manage seller registration requests.
            </p>

            {/* 1. Status Tabs */}
            <ApplicationStatusTabs
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                tabCounts={tabCounts}
            />

            {/* 2. Filters & Search */}
            <ApplicationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalCount={totalItems}
            />

            {/* 3. Error Banner (if error occurred during load) */}
            {error && (
                <div style={{
                    padding: "14px 18px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    color: "#991b1b",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <span>{error}</span>
                    <Button size="sm" variant="outline" onClick={fetchApplications}>
                        Retry
                    </Button>
                </div>
            )}

            {/* 4. Table or Loading Skeleton */}
            {loading ? (
                <AdminTableSkeleton />
            ) : (
                <ApplicationTable
                    applications={paginatedApplications}
                    onView={handleViewDetail}
                    onStartReview={openStartReviewDialog}
                    onApprove={openApproveDialog}
                    onReject={openRejectDialog}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* 5. Application Detail View (Modal) */}
            {selectedDetail && (
                <ApplicationDetailPage
                    detail={selectedDetail}
                    loading={detailLoading}
                    onClose={handleCloseDetail}
                    onStartReview={openStartReviewDialog}
                    onApprove={openApproveDialog}
                    onReject={openRejectDialog}
                />
            )}

            {/* 6. Decision Confirmation Dialog (Start Review / Approve / Reject) */}
            <ApplicationDecisionDialog
                isOpen={decisionDialog.isOpen}
                type={decisionDialog.type}
                applicationId={decisionDialog.applicationId}
                applicationName={decisionDialog.applicationName}
                isSubmitting={decisionSubmitting}
                onClose={closeDecisionDialog}
                onConfirmStartReview={confirmStartReview}
                onConfirmApprove={confirmApprove}
                onConfirmReject={confirmReject}
            />
        </div>
    );
};

export default AdminSellerApplicationsPage;
