import styles from "./ReviewSort.module.css";
import { useLanguage } from '@/shared/context/LanguageContext';

export default function ReviewSort({ value, onChange }) {
    const { t } = useLanguage();

    return (
        <div className={styles.sort}>

            <select aria-label="Sort reviews" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="newest">{t('productDetail.newest') || 'Newest'}</option>
                <option value="oldest">{t('productDetail.oldest') || 'Oldest'}</option>
                <option value="highest">{t('productDetail.highestRating') || 'Highest Rating'}</option>
                <option value="lowest">{t('productDetail.lowestRating') || 'Lowest Rating'}</option>
            </select>

        </div>
    );
}