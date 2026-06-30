import styles from "./ProductDetailPage.module.css";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

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
import ProductSectionNav from "../components/detail/navigation/ProductSectionNav";
import ProductDescription from "../components/detail/description/ProductDescription";
import TrustBadges from "../components/detail/trust/TrustBadges";
import Breadcrumb from "../components/detail/breadcrumb/Breadcrumb";
import RelatedProducts from "../components/detail/related/RelatedProducts";

import { ROUTES } from "@/config/route.config";

// Navigation sections — defined outside to avoid recreation on re-render
const PRODUCT_SECTIONS = [
    { id: "description", label: "Description" },
    { id: "shop",        label: "Shop" },
    { id: "reviews",     label: "Reviews" },
];

export default function ProductDetail() {

    const navigate = useNavigate();
    const { slug } = useParams();

    const {
        product,
        loading,
        selectedAttributes,
        handleSelectAttribute,
        selectedVariant,
    } = useProductDetail(slug);

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeSection, setActiveSection] = useState("description");

    // Sticky nav visibility — true only after sentinel scrolls out of viewport
    const [navVisible, setNavVisible] = useState(false);

    // Ref on the top sentinel block for IntersectionObserver
    const sentinelRef = useRef(null);

    // Ref on the overview block
    const overviewRef = useRef(null);

    /* Sync selected image with product load */
    useEffect(() => {
        if (!product?.images?.length) return;
        const primary = product.images.find(img => img.isPrimary) ?? product.images[0];
        setSelectedImage(primary.imageUrl);
    }, [product]);

    /* Build variant → image map */
    const variantImageMap = useMemo(() => {
        const map = {};
        product?.images?.forEach(img => {
            if (img.variantId) map[img.variantId] = img.imageUrl;
        });
        return map;
    }, [product]);

    /* Sync quantity cap and image when variant changes */
    useEffect(() => {
        if (!selectedVariant) return;

        setQuantity(prev =>
            Math.min(prev, Math.max(selectedVariant.availableStock, 1))
        );

        const variantImage = variantImageMap[selectedVariant.variantId];
        if (variantImage) setSelectedImage(variantImage);
    }, [selectedVariant, variantImageMap]);

    /* Show sticky nav only after sentinel scrolls out of viewport */
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setNavVisible(!entry.isIntersecting),
            { threshold: 0 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loading, product]);

    /* Track which section is in view while scrolling */
    useEffect(() => {
        const sectionEls = PRODUCT_SECTIONS
            .map(s => document.getElementById(s.id))
            .filter(Boolean);

        if (!sectionEls.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
        );

        sectionEls.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [loading, product]);

    /* Smooth scroll to section on tab click */
    const handleNavigate = useCallback((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        setActiveSection(sectionId);
    }, []);

    if (loading) return <ProductDetailSkeleton />;

    if (!product) {
        return (
            <div className={styles.notFound}>
                <span className={styles.notFoundIcon}>🔍</span>
                <p>Product not found.</p>
                <a href={ROUTES.PRODUCTS_LIST} className={styles.notFoundLink}>
                    Browse all products
                </a>
            </div>
        );
    }

    const handleBuyNow = () => {
        navigate(ROUTES.CHECKOUT, {
            state: {
                mode: "buy-now",
                buyNow: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId ?? null,
                    quantity,
                    paymentMethod: "cod",
                    voucherCodes: [],
                },
            },
        });
    };

    const handleAddToCart = () => {
        navigate(ROUTES.CART, {
            state: {
                mode: "add-to-cart",
                addToCart: {
                    productId: product.productId,
                    variantId: selectedVariant?.variantId ?? null,
                    quantity,
                },
            },
        });
    };

    return (
        <div className={styles.page}>

            {/* Top sentinel to trigger sticky navigation visibility */}
            <div ref={sentinelRef} className={styles.sentinel} />

            {/* Breadcrumb — home > products > category > name */}
            <Breadcrumb
                categoryName={product.categoryName}
                productName={product.name}
            />

            {/* Overview: gallery + product info — observed for sticky nav trigger */}
            <div className={styles.overview} ref={overviewRef}>

                <div className={styles.galleryCol}>
                    <ProductGallery
                        images={product.images ?? []}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                    />
                </div>

                <div className={styles.infoCol}>

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

                    {/* Trust signals below action buttons */}
                    <TrustBadges />

                    <ProductShare />

                </div>

            </div>

            {/* Sticky section navigation — appears after overview leaves viewport */}
            <ProductSectionNav
                sections={PRODUCT_SECTIONS}
                activeSection={activeSection}
                onNavigate={handleNavigate}
                isVisible={navVisible}
            />

            <section id="description" className={styles.section}>
                <ProductDescription description={product.description} />
            </section>

            <section id="shop" className={styles.section}>
                <ShopInfo shop={product.shop} />
            </section>

            <section id="reviews" className={styles.section}>
                <ProductReviews
                    productId={product.productId}
                    shopName={product.shop?.shopName}
                />
            </section>

            {/* Related products — same category, excludes current */}
            <RelatedProducts
                categoryName={product.categoryName}
                currentProductId={product.productId}
            />

        </div>
    );

}