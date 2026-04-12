import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            {/* Icon */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-primary/5
                            flex items-center justify-center mb-6">
                <FiShoppingCart className="text-primary/40" size={48} />
            </div>

            {/* Text */}
            <h2 className="text-xl font-semibold text-text-primary mb-2">
                Giỏ hàng của bạn còn trống
            </h2>
            <p className="text-text-secondary text-sm mb-8 text-center max-w-sm">
                Hãy khám phá thêm các sản phẩm và thêm vào giỏ hàng nhé!
            </p>

            {/* CTA */}
            <Link
                to="/"
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg
                           shadow-card hover:shadow-hover transition-all duration-200
                           transform hover:-translate-y-0.5 active:translate-y-0"
            >
                Mua Sắm Ngay
            </Link>
        </div>
    );
}
