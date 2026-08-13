import axiosClient from "@/shared/features/auth/api/axiosClient";

const REVIEW_URL = "/products";

export const reviewService = {
    getProductReviews(productId, params) {
        return axiosClient.get(
            `${REVIEW_URL}/${productId}/reviews`,
            { params }
        );
    }
};
