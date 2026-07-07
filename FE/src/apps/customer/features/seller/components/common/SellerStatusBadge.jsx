export default function SellerStatusBadge({ status }) {
    if (!status) return null;

    return (
        <span>
            {status}
        </span>
    );
}