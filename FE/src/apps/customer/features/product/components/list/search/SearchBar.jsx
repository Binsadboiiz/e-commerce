import { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";
import { 
    FaSearch, 
    FaSpinner, 
    FaTimes, 
    FaHistory, 
    FaFire, 
    FaTag, 
    FaFolderOpen,
    FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route.config";
import { useInstantSearch } from "../../../hooks/useInstantSearch";
import formatPrice from "../../../utils/formatPrice";

const POPULAR_KEYWORDS = ["iPhone 15", "Laptop Gaming", "Tai nghe Sony", "Bàn phím cơ", "Samsung Galaxy"];

export default function SearchBar({
    placeholder = "Tìm kiếm sản phẩm, thương hiệu, danh mục...",
    initialQuery = ""
}) {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const {
        query,
        setQuery,
        suggestions,
        loading,
        isOpen,
        setIsOpen,
        recentSearches,
        saveRecentSearch,
        removeRecentSearch,
        clearRecentSearches
    } = useInstantSearch();

    // Đồng bộ initialQuery nếu có thay đổi từ URL
    useEffect(() => {
        if (initialQuery && initialQuery !== query) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    // Xử lý Click Outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsOpen]);

    // Điều hướng tìm kiếm theo keyword
    const handleExecuteSearch = (searchKeyword) => {
        const term = (searchKeyword ?? query).trim();
        if (!term) return;

        saveRecentSearch(term);
        setIsOpen(false);
        navigate(`${ROUTES.PRODUCTS_LIST}?q=${encodeURIComponent(term)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleExecuteSearch();
    };

    const handleClear = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    // Điều hướng khi click danh mục gợi ý
    const handleCategoryClick = (cat) => {
        saveRecentSearch(cat.name);
        setIsOpen(false);
        navigate(`${ROUTES.PRODUCTS_LIST}?categoryIds=${cat.id}`);
    };

    // Điều hướng khi click thương hiệu gợi ý
    const handleBrandClick = (brand) => {
        saveRecentSearch(brand.name);
        setIsOpen(false);
        navigate(`${ROUTES.PRODUCTS_LIST}?brandIds=${brand.id}`);
    };

    // Điều hướng khi click sản phẩm
    const handleProductClick = (prod) => {
        saveRecentSearch(prod.name);
        setIsOpen(false);
        navigate(`/products/${prod.slug || prod.id}`);
    };

    const hasResults =
        (suggestions.categories && suggestions.categories.length > 0) ||
        (suggestions.brands && suggestions.brands.length > 0) ||
        (suggestions.products && suggestions.products.length > 0) ||
        (suggestions.keywords && suggestions.keywords.length > 0);

    const isQueryEmpty = query.trim().length === 0;

    // Highlight text trùng khớp
    const highlightMatch = (text) => {
        if (!query.trim() || !text) return text;
        const trimmed = query.trim();
        const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className={styles.highlightText}>
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <div className={styles.searchContainer} ref={containerRef}>
            <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className={styles.input}
                    value={query}
                    autoComplete="off"
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setIsOpen(false);
                        }
                    }}
                />

                {/* Nút xóa từ khóa */}
                {query.length > 0 && !loading && (
                    <button
                        type="button"
                        className={styles.clearBtn}
                        onClick={handleClear}
                        aria-label="Xóa từ khóa"
                        title="Xóa từ khóa"
                    >
                        <FaTimes size={13} />
                    </button>
                )}

                {/* Loading spinner */}
                {loading && (
                    <span className={styles.spinnerWrapper}>
                        <FaSpinner className={styles.spinner} size={14} />
                    </span>
                )}

                {/* Submit button */}
                <button type="submit" className={styles.button} aria-label="Tìm kiếm">
                    <FaSearch size={15} />
                </button>
            </form>

            {/* AUTOCOMPLETE POPUP DROPDOWN */}
            {isOpen && (
                <div className={styles.suggestionsDropdown}>
                    {/* TRƯỜNG HỢP 1: Chưa nhập từ khóa -> Hiện Lịch sử tìm kiếm & Gợi ý hot */}
                    {isQueryEmpty && (
                        <div className={styles.emptyStateSection}>
                            {recentSearches.length > 0 && (
                                <div className={styles.suggestionGroup}>
                                    <div className={styles.groupHeader}>
                                        <span className={styles.groupTitle}>
                                            <FaHistory className={styles.groupIcon} /> Lịch sử tìm kiếm
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.clearAllBtn}
                                            onClick={clearRecentSearches}
                                        >
                                            Xóa tất cả
                                        </button>
                                    </div>
                                    <div className={styles.recentList}>
                                        {recentSearches.map((item, index) => (
                                            <div key={index} className={styles.recentItem}>
                                                <span
                                                    className={styles.recentText}
                                                    onClick={() => {
                                                        setQuery(item);
                                                        handleExecuteSearch(item);
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={styles.removeRecentBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeRecentSearch(item);
                                                    }}
                                                    title="Xóa"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.suggestionGroup}>
                                <div className={styles.groupHeader}>
                                    <span className={styles.groupTitle}>
                                        <FaFire className={styles.hotIcon} /> Tìm kiếm phổ biến
                                    </span>
                                </div>
                                <div className={styles.tagGroup}>
                                    {POPULAR_KEYWORDS.map((tag, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={styles.popularTag}
                                            onClick={() => {
                                                setQuery(tag);
                                                handleExecuteSearch(tag);
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TRƯỜNG HỢP 2: Đang nhập từ khóa và có kết quả */}
                    {!isQueryEmpty && hasResults && (
                        <div className={styles.resultsContent}>
                            {/* Từ khóa gợi ý */}
                            {suggestions.keywords?.length > 0 && (
                                <div className={styles.keywordList}>
                                    {suggestions.keywords.slice(0, 3).map((kw, i) => (
                                        <div
                                            key={i}
                                            className={styles.keywordItem}
                                            onClick={() => {
                                                setQuery(kw);
                                                handleExecuteSearch(kw);
                                            }}
                                        >
                                            <FaSearch size={12} className={styles.keywordIcon} />
                                            <span>{highlightMatch(kw)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Danh mục gợi ý */}
                            {suggestions.categories?.length > 0 && (
                                <div className={styles.suggestionGroup}>
                                    <div className={styles.groupTitle}>
                                        <FaFolderOpen className={styles.groupIcon} /> Danh mục liên quan
                                    </div>
                                    <div className={styles.tagGroup}>
                                        {suggestions.categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                className={styles.categoryPill}
                                                onClick={() => handleCategoryClick(cat)}
                                            >
                                                📁 {highlightMatch(cat.name)}
                                                {cat.productCount > 0 && (
                                                    <span className={styles.pillCount}>({cat.productCount})</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Thương hiệu gợi ý */}
                            {suggestions.brands?.length > 0 && (
                                <div className={styles.suggestionGroup}>
                                    <div className={styles.groupTitle}>
                                        <FaTag className={styles.groupIcon} /> Thương hiệu
                                    </div>
                                    <div className={styles.tagGroup}>
                                        {suggestions.brands.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                className={styles.brandPill}
                                                onClick={() => handleBrandClick(b)}
                                            >
                                                🏷️ {highlightMatch(b.name)}
                                                {b.productCount > 0 && (
                                                    <span className={styles.pillCount}>({b.productCount})</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Sản phẩm nổi bật */}
                            {suggestions.products?.length > 0 && (
                                <div className={styles.suggestionGroup}>
                                    <div className={styles.groupTitle}>Sản phẩm nổi bật</div>
                                    <div className={styles.productList}>
                                        {suggestions.products.map((prod) => (
                                            <div
                                                key={prod.id}
                                                className={styles.productCard}
                                                onClick={() => handleProductClick(prod)}
                                            >
                                                <div className={styles.thumbWrapper}>
                                                    <img
                                                        src={prod.imageUrl || "/logo.png"}
                                                        alt={prod.name}
                                                        className={styles.productImg}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className={styles.productDetails}>
                                                    <span className={styles.productTitle}>
                                                        {highlightMatch(prod.name)}
                                                    </span>
                                                    <div className={styles.productMeta}>
                                                        {prod.ratingAvg > 0 && (
                                                            <span className={styles.ratingBadge}>
                                                                <FaStar size={10} color="#f59e0b" />
                                                                {prod.ratingAvg.toFixed(1)}
                                                            </span>
                                                        )}
                                                        {prod.categoryName && (
                                                            <span className={styles.categoryBadge}>
                                                                {prod.categoryName}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.priceContainer}>
                                                        <span className={styles.finalPrice}>
                                                            {formatPrice(prod.finalPrice || prod.price)}
                                                        </span>
                                                        {prod.discountPrice && prod.discountPrice < prod.price && (
                                                            <span className={styles.oldPrice}>
                                                                {formatPrice(prod.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer chuyển sang trang tìm kiếm */}
                            <div
                                className={styles.dropdownFooter}
                                onClick={() => handleExecuteSearch()}
                            >
                                <span>Xem tất cả kết quả cho <strong>"{query}"</strong></span>
                                <span className={styles.arrowIcon}>→</span>
                            </div>
                        </div>
                    )}

                    {/* TRƯỜNG HỢP 3: Không có kết quả */}
                    {!isQueryEmpty && !hasResults && !loading && (
                        <div className={styles.emptyState}>
                            <p>Không tìm thấy kết quả phù hợp cho "<strong>{query}</strong>"</p>
                            <span className={styles.emptySubtext}>
                                Thử kiểm tra lỗi chính tả hoặc tìm kiếm bằng từ khóa chung hơn.
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}