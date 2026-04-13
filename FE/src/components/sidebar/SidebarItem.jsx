import styles from "./sidebar.module.css";
import { ChevronDown } from "lucide-react";

/**
 * <summary>
 * renders a single navigation row: icon + label + optional expand chevron.
 * </summary>
 */
export default function SidebarItem({
    itemKey,
    label,
    icon,
    isActive,
    isCollapsed,
    hasChildren,
    isOpen,
    variant,
    onClick,
}) {
    const classNames = [
        styles.item,
        isActive && styles.itemActive,
        variant === "danger" && styles.itemDanger,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            className={classNames}
            onClick={() => onClick(itemKey)}
            aria-label={isCollapsed ? label : undefined}
            title={isCollapsed ? label : undefined}
            aria-current={isActive ? "page" : undefined}>
            <span className={styles.itemIcon}>{icon}</span>

            <span
                className={`${styles.itemLabel} ${isCollapsed ? styles.itemLabelHidden : ""
                    }`}>
                {label}
            </span>

            {hasChildren && !isCollapsed && (
                <span
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""
                        }`}>
                    <ChevronDown size={14} />
                </span>
            )}
        </button>
    );
}