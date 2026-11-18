import { useEffect, useMemo, useState } from "react";
import { productsService } from "../services/productService";

export default function useProductDetail(slug) {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);

        productsService.getProductDetail(slug)
            .then((productData) => {

                setProduct(productData);

                // DEFAULT IMAGE
                if (productData.images?.length > 0) {
                    setActiveImage(productData.images[0]);
                }

                // DEFAULT VARIANT
                if (productData.variants?.length > 0) {

                    const firstVariant = productData.variants[0];

                    const initialAttributes = {};

                    firstVariant.attributes.forEach(attr => {
                        initialAttributes[attr.attributeId] = attr.valueId;
                    });

                    setSelectedAttributes(initialAttributes);
                }
            })
            .catch((err) => {
                
                setProduct(null);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [slug]);

    const variantKey = useMemo(() => {

        return Object.entries(selectedAttributes)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([, valueId]) => valueId)
            .join("-");

    }, [selectedAttributes]);

    const selectedVariant = useMemo(() => {

        if (!product) return null;

        const variantId = product.variantMap?.[variantKey];

        return product.variants?.find(
            variant => variant.variantId === variantId
        ) || null;

    }, [product, variantKey]);

    const handleSelectAttribute = (attributeId, valueId) => {

        setSelectedAttributes(prev => ({
            ...prev,
            [attributeId]: valueId
        }));

    };

    return {
        product, loading, activeImage, setActiveImage,
        selectedAttributes, selectedVariant, handleSelectAttribute
    };
}