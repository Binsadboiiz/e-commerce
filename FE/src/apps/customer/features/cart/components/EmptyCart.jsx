import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function EmptyCart() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center">
            {/* Visual Icon Badge */}
            <div className="w-24 h-24 rounded-full bg-red-50 text-primary
                            flex items-center justify-center mb-6 shadow-sm border border-red-100">
                <FiShoppingCart size={42} />
            </div>

            {/* Empty Title & Subtitle */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                {t('emptyTitle')}
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md leading-relaxed">
                {t('emptySubtitle')}
            </p>

            {/* Redesigned Enterprise CTA Button */}
            <Link
                to="/"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 
                           bg-primary hover:bg-[#d73211] active:bg-[#b8280c]
                           text-white font-semibold text-base rounded-xl
                           shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                           transition-all duration-200 group cursor-pointer"
            >
                <span>{t('shopNow')}</span>
                <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
