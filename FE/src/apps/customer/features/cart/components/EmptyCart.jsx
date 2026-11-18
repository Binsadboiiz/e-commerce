import { FiShoppingCart } from 'react-icons/fi';
import { ROUTES } from '@/config/route.config';
import { useLanguage } from '@/shared/context/LanguageContext';
import EmptyState from '@/shared/components/ui/EmptyState';

export default function EmptyCart() {
    const { t } = useLanguage();

    return (
        <EmptyState
            icon={<FiShoppingCart size={36} />}
            title={t('cart.emptyTitle') || t('emptyTitle') || "Giỏ hàng của bạn đang trống"}
            description={t('cart.emptySubtitle') || t('emptySubtitle') || "Hãy khám phá thêm nhiều sản phẩm chất lượng với ưu đãi đặc biệt hôm nay!"}
            actionText={t('cart.shopNow') || t('shopNow') || "Khám Phá Ngay"}
            actionLink={ROUTES.PRODUCTS_LIST || "/products"}
        />
    );
}
