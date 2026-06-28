import styles from "./ProductDetailPage.module.css";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import useProductDetail from "../hooks/useProductDetail";

import ProductGallery from "../components/detail/gallery/ProductGallery";
import ProductInfo from "../components/detail/info/ProductInfo";
import ProductActions from "../components/detail/actions/ProductActions";
import ProductDetailSkeleton from "../components/detail/ProductDetailSkeleton";
import VariantSelector from "../components/detail/variant/VariantSelector";
import ProductShippingInfo from "../components/detail/shipping/ProductShippingInfo";
import ProductShare from "../components/detail/share/ProductShare";
import ShopInfo from "../components/detail/shop/ShopInfo";
import ProductReviews from "../components/detail/reviews/ProductReviews";

import { ROUTES } from "@/config/route.config";

export default function ProductDetail() {

    const navigate = useNavigate();
    const { slug } = useParams();

    const {
        product,
        loading,
        selectedAttributes,
        handleSelectAttribute,
        selectedVariant
    } = useProductDetail(slug);

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (!product?.images?.length) return;

        const primary =
            product.images.find(i => i.isPrimary) ??
            product.images[0];

        setSelectedImage(primary.imageUrl);
    }, [product]);

    const variantImageMap = useMemo(() => {
        const map = {};

        product?.images?.forEach(img => {
            if (img.variantId) {
                map[img.variantId] = img.imageUrl;
            }
        });

        return map;
    }, [product]);

    useEffect(() => {
        if (!selectedVariant) return;

        setQuantity(prev =>
            Math.min(
                prev,
                Math.max(selectedVariant.availableStock, 1)
            )
        );

        const variantImage =
            variantImageMap[selectedVariant.variantId];

        if (variantImage) {
            setSelectedImage(variantImage);
        }

    }, [selectedVariant, variantImageMap]);

    if (loading)
        return <ProductDetailSkeleton />;

    if (!product)
        return <div className={styles.notFound}>Product not found.</div>;

    const handleBuyNow = () => {
        navigate(ROUTES.CHECKOUT, {
            state: {
                mode: "buy-now",
                buyNow: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId ?? null,
                    quantity,
                    paymentMethod: "cod",
                    voucherCodes: []
                }
            }
        });
    };

    const handleAddToCart = () => {
        navigate(ROUTES.CART, {
            state: {
                mode: "add-to-cart",
                addToCart: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId ?? null,
                    quantity
                }
            }
        });
    };

    return (
        <div className={styles.page}>

            <div className={styles.container}>

                <div className={styles.left}>
                    <ProductGallery
                        images={product.images ?? []}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                    />
                </div>

                <div className={styles.right}>

                    <ProductInfo
                        product={product}
                        selectedVariant={selectedVariant}
                    />

                    <ProductShippingInfo />

                    <VariantSelector
                        attributes={product.attributes}
                        selectedAttributes={selectedAttributes}
                        onSelect={handleSelectAttribute}
                    />

                    <ProductActions
                        product={product}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        onBuyNow={handleBuyNow}
                        onAddToCart={handleAddToCart}
                    />

                    <ProductShare />

                </div>

            </div>

            <section className={styles.shopSection}>
                <ShopInfo shop={product.shop} />
            </section>

            <section className={styles.reviewSection}>
                <ProductReviews productId={product.productId} />
            </section>

        </div>
    );
}