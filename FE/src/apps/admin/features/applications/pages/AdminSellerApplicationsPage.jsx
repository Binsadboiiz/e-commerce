import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosClient from "@/shared/features/auth/api/axiosClient";
import Button from "@/shared/components/ui/Button";
import styles from "./AdminSellerApplications.module.css";
import { AdminTableSkeleton, AdminDetailModalSkeleton } from "@/apps/admin/components/AdminTableSkeleton";

export const AdminSellerApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get("/admin/dashboard/seller-applications");
            setApplications(res ?? []);
        } catch (error) {
            console.error("Failed to load applications:", error);
            toast.error("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleViewDetail = async (id) => {
        try {
            setDetailLoading(true);
            setSelectedDetail({}); // open modal immediately with loader
            const res = await axiosClient.get(`/admin/dashboard/seller-applications/${id}`);
            setSelectedDetail(res);
        } catch (error) {
            toast.error("Failed to load details.");
            setSelectedDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axiosClient.post(`/admin/dashboard/seller-applications/${id}/approve`);
            toast.success("Application approved!");
            if (selectedDetail?.summary?.sellerId === id) {
                setSelectedDetail(prev => ({
                    ...prev,
                    summary: { ...prev.summary, sellerStatusCode: "APPROVED" }
                }));
            }
            fetchApplications();
        } catch (error) {
            toast.error("Failed to approve.");
        }
    };

    const handleReject = async (id) => {
        try {
            await axiosClient.post(`/admin/dashboard/seller-applications/${id}/reject`);
            toast.success("Application rejected.");
            if (selectedDetail?.summary?.sellerId === id) {
                setSelectedDetail(prev => ({
                    ...prev,
                    summary: { ...prev.summary, sellerStatusCode: "REJECTED" }
                }));
            }
            fetchApplications();
        } catch (error) {
            toast.error("Failed to reject.");
        }
    };

    const statusLabel = (status) => {
        if (status === "APPROVED") return "Approved";
        if (status === "REJECTED") return "Rejected";
        if (status === "PENDING")  return "Pending";
        return status;
    };

    const statusClass = (status) => {
        if (status === "APPROVED") return styles.badgeApproved;
        if (status === "REJECTED") return styles.badgeRejected;
        return styles.badgePending;
    };
    if (loading) return <AdminTableSkeleton />;

    return (
        <div className={styles.container}>
            <SEOHead 
                title="Quản Lý Đơn Đăng Ký Seller | Admin Portal" 
                robots="noindex, nofollow" 
                description="Trang duyệt đơn đăng ký bán hàng của các đối tác seller."
            />
            <h1 className={styles.title}>Seller Applications</h1>
            <p className={styles.subtitle}>Review and manage seller registration requests.</p>

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
                    {applications.map((app) => (
                        <tr key={app.id}>
                            <td>
                                <div><strong>{app.representative}</strong></div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{app.email}</div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{app.phone}</div>
                            </td>
                            <td>
                                <div><strong>{app.companyName || "N/A"}</strong></div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>Tax: {app.taxCode || "N/A"}</div>
                            </td>
                            <td>
                                <span style={{ fontSize: "13px", color: "#475569" }}>{app.sellerType}</span>
                            </td>
                            <td>
                                <span className={`${styles.badge} ${statusClass(app.status)}`}>
                                    {statusLabel(app.status)}
                                </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewDetail(app.id)}
                                    >
                                        View
                                    </Button>
                                    {app.status === "PENDING" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleApprove(app.id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleReject(app.id)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {app.status !== "PENDING" && (
                                        <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                                No applications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Detail Modal */}
            {selectedDetail && (
                <div className={styles.modalOverlay} onClick={() => setSelectedDetail(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Application Detail</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedDetail(null)}>✕</button>
                        </div>

                        {detailLoading ? (
                            <AdminDetailModalSkeleton />
                        ) : (
                            <div className={styles.modalBody}>
                                {/* Summary */}
                                <div className={styles.section}>
                                    <h3 className={styles.sectionTitle}>Overview</h3>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Seller Type</span>
                                            <span className={styles.infoValue}>{selectedDetail.summary?.sellerTypeCode}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Status</span>
                                            <span className={`${styles.badge} ${statusClass(selectedDetail.summary?.sellerStatusCode)}`}>
                                                {statusLabel(selectedDetail.summary?.sellerStatusCode)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                {selectedDetail.address && (
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>Address</h3>
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Full Name</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.fullName}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Phone</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.phoneNumber}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>City</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.city}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>District</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.district}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Ward</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.ward}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Street Address</span>
                                                <span className={styles.infoValue}>{selectedDetail.address.streetAddress}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bank */}
                                {selectedDetail.bank && (
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>Bank Account</h3>
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Bank</span>
                                                <span className={styles.infoValue}>{selectedDetail.bank.bankCode}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Account Number</span>
                                                <span className={styles.infoValue}>{selectedDetail.bank.accountNumber}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Account Holder</span>
                                                <span className={styles.infoValue}>{selectedDetail.bank.accountName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Business */}
                                {selectedDetail.business && (
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>Business Information</h3>
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Company Name</span>
                                                <span className={styles.infoValue}>{selectedDetail.business.companyName}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Tax Code</span>
                                                <span className={styles.infoValue}>{selectedDetail.business.taxCode}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>License Number</span>
                                                <span className={styles.infoValue}>{selectedDetail.business.businessLicenseNumber}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Representative</span>
                                                <span className={styles.infoValue}>{selectedDetail.business.representative}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Documents */}
                                {selectedDetail.documents?.length > 0 && (
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>Verification Documents</h3>
                                        <div className={styles.docGrid}>
                                            {selectedDetail.documents.map((doc) => (
                                                <div key={doc.documentId} className={styles.docItem}>
                                                    <span className={styles.docType}>{doc.documentType}</span>
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={doc.fileUrl}
                                                            alt={doc.documentType}
                                                            className={styles.docImage}
                                                        />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {selectedDetail.summary?.sellerStatusCode === "PENDING" && (
                                    <div className={styles.modalActions}>
                                        <Button
                                            variant="success"
                                            onClick={() => handleApprove(selectedDetail.summary.sellerId)}
                                        >
                                            ✓ Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleReject(selectedDetail.summary.sellerId)}
                                        >
                                            ✕ Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSellerApplicationsPage;
