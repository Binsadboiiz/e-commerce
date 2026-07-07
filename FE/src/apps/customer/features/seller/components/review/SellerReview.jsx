import styles from "./SellerReview.module.css";

export default function SellerReview({
    registration,
    onSubmit
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
                        value={summary?.sellerTypeName}
                    />

                    <Item
                        label="Status"
                        value={summary?.sellerStatusName}
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
                        value={bank?.bankName}
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
                            value={business.representativeName}
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
                            {document.documentTypeName || document.documentType}
                        </li>

                    ))}

                </ul>

            </section>

            <div className={styles.footer}>

                <button
                    type="button"
                    className={styles.submitButton}
                    onClick={onSubmit}
                >
                    Submit Registration
                </button>

            </div>

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