import styles from "./ProductDetailPage.module.css";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import useProductDetail from "../hooks/useProductDetail";

import ProductGallery from "../components/detail/gallery/ProductGallery";
import ProductInfo from "../components/detail/info/ProductInfo";
import ProductActions from "../components/detail/actions/ProductActions";
import ProductDetailSkeleton from "../components/detail/ProductDetailSkeleton";
import VariantSelector from "../components/detail/variant/VariantSelector";

import { ROUTES } from "@/config/route.config";

export default function ProductDetail() {

    const navigate = useNavigate();

    const { slug } = useParams();

    const { product, loading, selectedAttributes, handleSelectAttribute } = useProductDetail(slug);

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    //set default image
    useEffect(() => {
        if (!product?.images?.length) return;

        const primaryImage = product.images.find((x) => x.isPrimary) || product.images[0];

        setSelectedImage(primaryImage.imageUrl);
    }, [product]);

    //set variant image map
    const variantImageMap = useMemo(() => {
        const map = {};

        product?.images?.forEach((img) => {
            if (img.variantId) {
                map[img.variantId] = img.imageUrl;
            }
        });

        return map;
    }, [product]);

    //selected variant
    const selectedVariant = useMemo(() => {
        if (!product?.variantMap) return null;

        const values = Object.values(selectedAttributes);

        if (!values.length) return null;

        const key = values
            .sort((a, b) => a - b)
            .join("-");

        const variantId = product.variantMap[key];

        if (!variantId) return null;

        return product.variants.find(
            (variant) => variant.variantId === variantId
        );

    }, [selectedAttributes, product]);

    //effect change image when variant change
    useEffect(() => {
        if (!selectedVariant) return;

        const variantImage = variantImageMap[selectedVariant.variantId];

        if (variantImage) {
            setSelectedImage(variantImage);
        }
    }, [selectedVariant, variantImageMap]);

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <div className={styles.notFound}>Not found</div>;

    //buy now
    const handleBuyNow = () => {
        navigate(ROUTES.CHECKOUT, {
            state: {
                mode: "buy-now",
                buyNow: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId || null,
                    quantity,
                    paymentMethod: "cod",
                    voucherCodes: []
                }
            }
        });
    };

    //add to cart
    const handleAddToCart = () => {
        navigate(ROUTES.CART, {
            state: {
                mode: "add-to-cart",
                addToCart: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId || null,
                    quantity
                }
            }
        });
    };

    return (
        <div className={styles.container}>

            {/* LEFT - IMAGE */}
            <div className={styles.left}>
                <ProductGallery images={product.images || []}
                    selectedImage={selectedImage}
                    onSelectImage={setSelectedImage}
                />
            </div>

            {/* RIGHT - INFO */}
            <div className={styles.right}>

                <ProductInfo product={product} />

                <VariantSelector
                    attributes={product.attributes}
                    selectedAttributes={selectedAttributes}
                    onSelect={handleSelectAttribute}
                />

                {/* ACTIONS */}
                <ProductActions
                    product={product}
                    selectedVariant={selectedVariant}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onBuyNow={handleBuyNow}
                    onAddToCart={handleAddToCart}
                />
            </div>

        </div>
    );
}