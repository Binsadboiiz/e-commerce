import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useProductDetail from "../hooks/useProductDetail";
import { ROUTES } from "@/config/route.config";

export default function ProductDetail() {

    const navigate = useNavigate();

    const { slug } = useParams();

    const { product, loading } = useProductDetail(slug);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Not found</div>;

    const images = product?.images || [];

    const coverImage =
        images.find(i => i.isPrimary)?.imageUrl ||
        images[0]?.imageUrl;

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

    return (
        <div>
            <h1>{product.name}</h1>

            {coverImage ? (
                <img
                    src={coverImage}
                    alt={product.name}
                    style={{ width: 300, objectFit: "cover" }}
                />
            ) : (
                <div style={{ width: 300, height: 300, background: "#eee" }} />
            )}

            <div>
                Price: {product.discountPrice ?? product.price}
            </div>

            <button onClick={handleBuyNow}>Buy Now</button>

            <div>Brand: {product.brandName}</div>
            <div>Category: {product.categoryName}</div>

            <div>
                {images.map(img => (
                    <img
                        key={img.imageId}
                        src={img.imageUrl}
                        style={{ width: 80, marginRight: 8 }}
                    />
                ))}
            </div>
        </div>
    );
}