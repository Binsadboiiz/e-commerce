import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import axiosClient from "@/shared/features/auth/api/axiosClient";
import {
    SELLER_STATUS,
    TAB_KEYS,
    TABS_CONFIG,
    DECISION_TYPES
} from "../constants/applicationConstants";

export { SELLER_STATUS, TAB_KEYS, TABS_CONFIG, DECISION_TYPES };

const SELLER_APPLICATIONS_API = "/admin/seller-applications";

export function useSellerApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState(TAB_KEYS.PENDING);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [selectedDetail, setSelectedDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    //DECISION DIALOG for Start Review / Approve / Reject confirmations
    const [decisionDialog, setDecisionDialog] = useState({
        isOpen: false,
        type: null,
        applicationId: null,
        applicationName: ""
    });
    const [decisionSubmitting, setDecisionSubmitting] = useState(false);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosClient.get(SELLER_APPLICATIONS_API);
            setApplications(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to load seller applications:", err);
            const msg = err?.response?.data?.message || "Failed to load applications.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    //Reset pagination when active tab or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    //Compute counts for each tab
    const tabCounts = useMemo(() => {
        const counts = {
            [TAB_KEYS.PENDING]: 0,
            [TAB_KEYS.UNDER_REVIEW]: 0,
            [TAB_KEYS.APPROVED]: 0,
            [TAB_KEYS.REJECTED]: 0,
            [TAB_KEYS.ALL]: 0
        };

        applications.forEach(app => {
            if (app.status === SELLER_STATUS.DRAFT) return;
            counts[TAB_KEYS.ALL] += 1;
            if (counts[app.status] !== undefined) {
                counts[app.status] += 1;
            }
        });

        return counts;
    }, [applications]);

    //Filter by tab and search keyword
    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            if (app.status === SELLER_STATUS.DRAFT) return false;

            //Tab filter
            if (activeTab !== TAB_KEYS.ALL && app.status !== activeTab) {
                return false;
            }

            //Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.trim().toLowerCase();
                const rep = (app.representative || "").toLowerCase();
                const email = (app.email || "").toLowerCase();
                const phone = (app.phone || "").toLowerCase();
                const company = (app.companyName || "").toLowerCase();
                const tax = (app.taxCode || "").toLowerCase();
                const license = (app.licenseNumber || "").toLowerCase();

                const match = rep.includes(query) ||
                    email.includes(query) ||
                    phone.includes(query) ||
                    company.includes(query) ||
                    tax.includes(query) ||
                    license.includes(query);

                if (!match) return false;
            }

            return true;
        });
    }, [applications, activeTab, searchQuery]);

    //Pagination calculations
    const totalPages = Math.ceil(filteredApplications.length / pageSize) || 1;
    const paginatedApplications = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredApplications.slice(start, start + pageSize);
    }, [filteredApplications, currentPage, pageSize]);

    //Detail modal actions
    const handleViewDetail = async (id) => {
        try {
            setDetailLoading(true);
            setSelectedDetail({}); // open modal immediately with loader
            const res = await axiosClient.get(`${SELLER_APPLICATIONS_API}/${id}`);
            setSelectedDetail(res);
        } catch (err) {
            console.error("Failed to load application detail:", err);
            toast.error("Failed to load details.");
            setSelectedDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseDetail = () => {
        setSelectedDetail(null);
    };

    //Dialog openers
    const openStartReviewDialog = (id, name = "") => {
        setDecisionDialog({
            isOpen: true,
            type: DECISION_TYPES.START_REVIEW,
            applicationId: id,
            applicationName: name
        });
    };

    const openApproveDialog = (id, name = "") => {
        setDecisionDialog({
            isOpen: true,
            type: DECISION_TYPES.APPROVE,
            applicationId: id,
            applicationName: name
        });
    };

    const openRejectDialog = (id, name = "") => {
        setDecisionDialog({
            isOpen: true,
            type: DECISION_TYPES.REJECT,
            applicationId: id,
            applicationName: name
        });
    };

    const closeDecisionDialog = () => {
        setDecisionDialog({
            isOpen: false,
            type: null,
            applicationId: null,
            applicationName: ""
        });
    };

    //Execute decision: Start Review
    const confirmStartReview = async (id) => {
        try {
            setDecisionSubmitting(true);
            await axiosClient.post(`${SELLER_APPLICATIONS_API}/${id}/under-review`);
            toast.success("Application is now under review.");

            // Update in-memory detail if currently open
            if (selectedDetail?.summary?.sellerId === id) {
                setSelectedDetail(prev => ({
                    ...prev,
                    summary: { ...prev.summary, sellerStatusCode: SELLER_STATUS.UNDER_REVIEW }
                }));
            }

            closeDecisionDialog();
            fetchApplications();
        } catch (err) {
            console.error("Failed to start review:", err);
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to start review.";
            toast.error(typeof msg === "string" ? msg : "Failed to start review.");
        } finally {
            setDecisionSubmitting(false);
        }
    };

    //Execute decision: Approve
    const confirmApprove = async (id) => {
        try {
            setDecisionSubmitting(true);
            await axiosClient.post(`${SELLER_APPLICATIONS_API}/${id}/approve`);
            toast.success("Application approved successfully!");

            // Update in-memory detail if currently open
            if (selectedDetail?.summary?.sellerId === id) {
                setSelectedDetail(prev => ({
                    ...prev,
                    summary: { ...prev.summary, sellerStatusCode: SELLER_STATUS.APPROVED }
                }));
            }

            closeDecisionDialog();
            fetchApplications();
        } catch (err) {
            console.error("Failed to approve application:", err);
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to approve application.";
            toast.error(typeof msg === "string" ? msg : "Failed to approve application.");
        } finally {
            setDecisionSubmitting(false);
        }
    };

    //Execute decision: Reject
    const confirmReject = async (id, reason = "") => {
        try {
            setDecisionSubmitting(true);
            await axiosClient.post(`${SELLER_APPLICATIONS_API}/${id}/reject`, {
                reason: reason.trim()
            });
            toast.success("Application rejected.");

            if (selectedDetail?.summary?.sellerId === id) {
                setSelectedDetail(prev => ({
                    ...prev,
                    summary: {
                        ...prev.summary,
                        sellerStatusCode: SELLER_STATUS.REJECTED,
                        rejectionReason: reason.trim()
                    }
                }));
            }

            closeDecisionDialog();
            fetchApplications();
        } catch (err) {
            console.error("Failed to reject application:", err);
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to reject application.";
            toast.error(typeof msg === "string" ? msg : "Failed to reject application.");
        } finally {
            setDecisionSubmitting(false);
        }
    };

    return {
        applications,
        loading,
        error,
        fetchApplications,

        // Tabs & Filters
        activeTab,
        setActiveTab,
        tabCounts,
        searchQuery,
        setSearchQuery,

        // Pagination
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems: filteredApplications.length,
        paginatedApplications,

        // Detail
        selectedDetail,
        detailLoading,
        handleViewDetail,
        handleCloseDetail,

        // Decision Dialog & Actions
        decisionDialog,
        decisionSubmitting,
        openStartReviewDialog,
        openApproveDialog,
        openRejectDialog,
        closeDecisionDialog,
        confirmStartReview,
        confirmApprove,
        confirmReject
    };
}
