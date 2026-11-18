import toast from "react-hot-toast"

export const notify = {
    success: (message) => {
        toast.success(message);
    },

    error: (message) => {
        toast.error(message);
    },

    loading: (message) => {
        return toast.loading(message);
    },

    dismiss: (id) => {
        toast.dismiss(id);
    },

    warning: (message) =>
        toast(message, {
        icon: "⚠️",
    }),

    custom: (message) => {
        toast(message);
    }
}