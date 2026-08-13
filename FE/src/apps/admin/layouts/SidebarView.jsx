/**
 * Sidebar presentational component cho giao diện Admin.
 */

import { UTILITY_NAV } from "../constants/adminSidebar";
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
            aria-label="Admin navigation"
        >
            {/* Header thanh điều hướng */}
            <div className={styles.header}>
                {!isCollapsed && (
                    <span className={styles.logo}>VeloraMall Admin</span>
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

            {/* Danh sách điều hướng chính */}
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

            {/* Các tiện ích hỗ trợ */}
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
