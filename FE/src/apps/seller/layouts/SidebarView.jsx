/**
 * <summary>
 * Sidebar presentational component.
 * Renders UI only — no state logic.
 * Now accepts navItems prop for role-based rendering.
 * </summary>
 */

import { UTILITY_NAV } from "./sidebar.config.jsx";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import styles from "./sidebar.module.css";

const ICON_SIZE = 18;

export default function SidebarView({ navItems, isCollapsed, activeItem, openSections,
    onItemClick, onToggle, onToggleSection, }) {

    return (
        <aside
            className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}
            aria-label="Main navigation"
        >
            {/* header */}
            <div className={styles.header}>
                {!isCollapsed && (
                    <span className={styles.logo}>VeloraMall</span>
                )}

                <button
                    className={styles.toggleBtn}
                    onClick={onToggle}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen size={ICON_SIZE} />
                    ) : (
                        <PanelLeftClose size={ICON_SIZE} />
                    )}
                </button>
            </div>

            {/* primary nav — role-based via navItems prop */}
            <nav className={styles.navPrimary}>
                {navItems.map((item) =>
                    item.children ? (
                        <SidebarSection
                            key={item.key}
                            item={item}
                            activeItem={activeItem}
                            isCollapsed={isCollapsed}
                            openSections={openSections}
                            onItemClick={onItemClick}
                            onToggleSection={onToggleSection}
                        />
                    ) : (
                        <SidebarItem
                            key={item.key}
                            itemKey={item.key}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeItem === item.key}
                            isCollapsed={isCollapsed}
                            onClick={onItemClick}
                        />
                    )
                )}
            </nav>

            {/* utility nav */}
            <div className={styles.navUtility}>
                <div className={styles.divider} />

                {UTILITY_NAV.map((item) => (
                    <SidebarItem
                        key={item.key}
                        itemKey={item.key}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeItem === item.key}
                        isCollapsed={isCollapsed}
                        variant={item.variant}
                        onClick={onItemClick}
                    />
                ))}
            </div>
        </aside>
    );
}