import styles from "./SellerReview.module.css";

export default function SellerReview({
    registration,
    onSubmit,
    isReadOnly = false
}) {

    if (!registration) {
        return null;
    }

    const {
        summary,
        address,
        bank,
        business,
        documents = []
    } = registration;

    const sellerTypeName = summary?.sellerTypeCode === "BUSINESS" ? "Business" : "Individual";

    const formatStatus = (status) => {
        if (!status) return "-";
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const mapDocTypeToName = (type) => {
        switch (type) {
            case "IDENTITY_FRONT":
                return "Identity Card (Front)";
            case "IDENTITY_BACK":
                return "Identity Card (Back)";
            case "BUSINESS_LICENSE":
                return "Business License";
            default:
                return type ? type.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "-";
        }
    };

    return (
        <div className={styles.wrapper}>

            <div className={styles.header}>
                <h3>Review Your Registration</h3>

                <p>
                    Please review all information before submitting your
                    seller application.
                </p>
            </div>

            <section className={styles.section}>

                <h4>Seller Information</h4>

                <div className={styles.grid}>
                    <Item
                        label="Seller Type"
                        value={sellerTypeName}
                    />

                    <Item
                        label="Status"
                        value={formatStatus(summary?.sellerStatusCode)}
                    />
                </div>

            </section>

            <section className={styles.section}>

                <h4>Address Information</h4>

                <div className={styles.grid}>

                    <Item
                        label="Full Name"
                        value={address?.fullName}
                    />

                    <Item
                        label="Phone Number"
                        value={address?.phoneNumber}
                    />

                    <Item
                        label="City"
                        value={address?.city}
                    />

                    <Item
                        label="District"
                        value={address?.district}
                    />

                    <Item
                        label="Ward"
                        value={address?.ward}
                    />

                    <Item
                        label="Street Address"
                        value={address?.streetAddress}
                    />

                    <Item
                        label="Postal Code"
                        value={address?.postalCode}
                    />

                </div>

            </section>

            <section className={styles.section}>

                <h4>Bank Information</h4>

                <div className={styles.grid}>

                    <Item
                        label="Bank"
                        value={bank?.bankCode}
                    />

                    <Item
                        label="Account Holder"
                        value={bank?.accountName}
                    />

                    <Item
                        label="Account Number"
                        value={bank?.accountNumber}
                    />

                </div>

            </section>

            {business && (

                <section className={styles.section}>

                    <h4>Business Information</h4>

                    <div className={styles.grid}>

                        <Item
                            label="Company Name"
                            value={business.companyName}
                        />

                        <Item
                            label="Tax Code"
                            value={business.taxCode}
                        />

                        <Item
                            label="Business License"
                            value={business.businessLicenseNumber}
                        />

                        <Item
                            label="Representative"
                            value={business.representative}
                        />

                    </div>

                </section>

            )}

            <section className={styles.section}>

                <h4>Uploaded Documents</h4>

                <ul className={styles.documentList}>

                    {documents.length === 0 && (
                        <li>No documents uploaded.</li>
                    )}

                    {documents.map(document => (
                        <li key={document.documentId || document.documentType}>
                            {mapDocTypeToName(document.documentType)}
                        </li>
                    ))}

                </ul>

            </section>

            {!isReadOnly && summary?.sellerStatusCode !== "PENDING" && summary?.sellerStatusCode !== "UNDER_REVIEW" && (
                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={onSubmit}
                    >
                        Submit Registration
                    </button>
                </div>
            )}

        </div>
    );

}

function Item({
    label,
    value
}) {
    return (
        <div className={styles.item}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );
}