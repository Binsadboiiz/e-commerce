/**
 * <summary>
 * Sidebar container — manages collapsed + active state
 * and delegates rendering to SidebarView.
 * </summary>
 */

import { useState, useEffect } from "react";
import { PRIMARY_NAV } from "./sidebar.config.jsx";
import SidebarView from "./SidebarView";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState({});
    const [activeItem, setActiveItem] = useState("dashboard");

    const handleToggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const handleItemClick = (key) => {
        setActiveItem(key);
    };

    const handleToggleSection = (key) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        PRIMARY_NAV.forEach(section => {
            const hasActiveChild = section.children?.some(
                c => c.key === activeItem
            );

            if (hasActiveChild) {
                setOpenSections(prev => ({
                    ...prev,
                    [section.key]: true
                }));
            }
        });
    }, [activeItem]);

    return (
        <SidebarView
            isCollapsed={isCollapsed}
            activeItem={activeItem}
            openSections={openSections}
            onItemClick={handleItemClick}
            onToggle={handleToggleSidebar}
            onToggleSection={handleToggleSection}
        />
    );
}