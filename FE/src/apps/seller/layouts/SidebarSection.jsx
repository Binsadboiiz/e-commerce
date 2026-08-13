import SidebarItem from "./SidebarItem";
import styles from "./sidebar.module.css";

export default function SidebarSection({
    item,
    activeItem,
    isCollapsed,
    openSections,
    onItemClick,
    onToggleSection
}) {
    const hasActiveChild = item.children.some(
        (c) => c.key === activeItem
    );

    const isOpen = isCollapsed
        ? false
        : !!openSections?.[item.key];

    const isParentActive =
        item.key === activeItem || hasActiveChild;

    const handleParentClick = () => {
        if (isCollapsed) return;
        onToggleSection(item.key);
    };

    return (
        <div className={styles.section}>
            <SidebarItem
                itemKey={item.key}
                label={item.label}
                icon={item.icon}
                isActive={isParentActive}
                isCollapsed={isCollapsed}
                hasChildren={!isCollapsed}
                isOpen={isOpen}
                onClick={handleParentClick}
            />

            <div
                className={`${styles.subItems} ${isOpen ? styles.subItemsOpen : ""
                    }`}
            >
                {item.children.map((child) => (
                    <button
                        key={child.key}
                        className={`${styles.subItem} ${activeItem === child.key
                            ? styles.subItemActive
                            : ""
                            }`}
                        onClick={() => onItemClick(child.key)}
                    >
                        <span>{child.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}