import { statusToLabel } from "../utils/orderFormat";

const STATUS_CLASS = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-cyan-100 text-cyan-700",
    in_transit: "bg-sky-100 text-sky-700",
    out_for_delivery: "bg-violet-100 text-violet-700",
    delivered: "bg-emerald-100 text-emerald-700",
    delivery_failed: "bg-rose-100 text-rose-700",
    cancelled: "bg-zinc-200 text-zinc-700"
};

export default function OrderStatusBadge({ status, label }) {
    const styleClass = STATUS_CLASS[status] ?? "bg-zinc-100 text-zinc-700";

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styleClass}`}>
            {label || statusToLabel(status)}
        </span>
    );
}
