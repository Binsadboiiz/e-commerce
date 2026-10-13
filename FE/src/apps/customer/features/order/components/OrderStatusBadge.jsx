import { statusToLabel } from "../utils/orderFormat";

const STATUS_CONFIG = {
    pending: {
        badge: "bg-amber-50 text-amber-800 border-amber-300",
        dot: "bg-amber-500"
    },
    confirmed: {
        badge: "bg-blue-50 text-blue-800 border-blue-300",
        dot: "bg-blue-500"
    },
    preparing: {
        badge: "bg-indigo-50 text-indigo-800 border-indigo-300",
        dot: "bg-indigo-500"
    },
    shipped: {
        badge: "bg-cyan-50 text-cyan-800 border-cyan-300",
        dot: "bg-cyan-500"
    },
    in_transit: {
        badge: "bg-sky-50 text-sky-800 border-sky-300",
        dot: "bg-sky-500"
    },
    out_for_delivery: {
        badge: "bg-purple-50 text-purple-800 border-purple-300",
        dot: "bg-purple-500"
    },
    delivered: {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-300",
        dot: "bg-emerald-500"
    },
    completed: {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-300",
        dot: "bg-emerald-500"
    },
    processing: {
        badge: "bg-indigo-50 text-indigo-800 border-indigo-300",
        dot: "bg-indigo-500"
    },
    delivery_failed: {
        badge: "bg-rose-50 text-rose-800 border-rose-300",
        dot: "bg-rose-500"
    },
    cancelled: {
        badge: "bg-zinc-100 text-zinc-800 border-zinc-300",
        dot: "bg-zinc-500"
    }
};

const DEFAULT_CONFIG = {
    badge: "bg-slate-100 text-slate-800 border-slate-300",
    dot: "bg-slate-500"
};

export default function OrderStatusBadge({ status, label }) {
    const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG;

    return (
        <span
            className={`inline-flex items-center px-3.5 py-1.5 text-sm font-semibold rounded-[4px] border shadow-xs tracking-wide transition-colors ${config.badge}`}
        >
            <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${config.dot}`} />
            <span>{label || statusToLabel(status)}</span>
        </span>
    );
}
