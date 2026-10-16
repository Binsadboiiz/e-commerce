import React from "react";
import { TABS_CONFIG } from "../constants/applicationConstants";
import styles from "./ApplicationStatusTabs.module.css";

/**
 * ApplicationStatusTabs Component
 * Displays 5 filter tabs (Pending, Under Review, Approved, Rejected, All) with counts and active indicators.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently selected tab key
 * @param {Function} props.onSelectTab - Callback when a tab is clicked
 * @param {Object} props.tabCounts - Object containing counts for each tab
 */
export default function ApplicationStatusTabs({
    activeTab,
    onSelectTab,
    tabCounts = {}
}) {
    return (
        <div className={styles.tabsContainer} role="tablist">
            {TABS_CONFIG.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = tabCounts[tab.key] ?? 0;

                return (
                    <button
                        key={tab.key}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        className={`${styles.tabButton} ${isActive ? styles.tabActive : ""}`}
                        onClick={() => onSelectTab(tab.key)}
                    >
                        <span>{tab.label}</span>
                        <span className={styles.tabBadge}>{count}</span>
                    </button>
                );
            })}
        </div>
    );
}
