import styles from "./ProductDetailPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import useProductDetail from "../hooks/useProductDetail";

import ProductGallery from "../components/detail/gallery/ProductGallery";
import ProductInfo from "../components/detail/info/ProductInfo";
import ProductActions from "../components/detail/actions/ProductActions";
import ProductDetailSkeleton from "../components/detail/ProductDetailSkeleton";

import { ROUTES } from "@/config/route.config";

export default function ProductDetail() {

    const navigate = useNavigate();

    const { slug } = useParams();

    const { product, loading } = useProductDetail(slug);

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <div className={styles.notFound}>Not found</div>;

    const images = product?.images || [];

    const handleBuyNow = () => {
        navigate(ROUTES.CHECKOUT, {
            state: {
                mode: "buy-now",
                buyNow: {
                    productId: product.id,
                    quantity: 1,
                    paymentMethod: "cod",
                    voucherCodes: []
                }
            }
        });
    };

    const handleAddToCart = () => {
        console.log("ADD TO CART:", product);
        // TODO: dispatch cart action
    };

    return (
        <div className={styles.container}>

            {/* LEFT - IMAGE */}
            <div className={styles.left}>
                <ProductGallery images={product.images || []} />
            </div>

            {/* RIGHT - INFO */}
            <div className={styles.right}>

                <ProductInfo product={product} />

                {/* ACTIONS */}
                <ProductActions
                    product={product}
                    onBuyNow={handleBuyNow}
                    onAddToCart={handleAddToCart}
                />
            </div>

        </div>
    );
}