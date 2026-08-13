import axiosClient from "@/shared/features/auth/api/axiosClient";

const sellerApi = {
    getRegistration: () => axiosClient.get("/seller/registration"),
    createRegistration: (payload) => axiosClient.post("/seller/registration", payload),
    updateRegistration: (payload) => axiosClient.put("/seller/registration", payload),
    submitRegistration: () => axiosClient.post("/seller/registration/submit"),
    uploadDocument: (payload) => axiosClient.post("/seller/documents", payload),
    deleteDocument: (id) => axiosClient.delete(`/seller/documents/${id}`),
    getHeader: () => axiosClient.get("/seller/header"),
    uploadImage: (formData) => axiosClient.post("/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    updateSellerType: (payload) => axiosClient.put("/seller/registration/seller-type", payload),
};

export default sellerApi;