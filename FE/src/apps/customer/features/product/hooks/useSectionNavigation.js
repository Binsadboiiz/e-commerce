import { useCallback } from "react";

export default function useSectionNavigation() {

    /**
     * Smooth scroll to a page section.
     * Offset is used to avoid sticky header covering the title.
     */
    const scrollToSection = useCallback((id) => {

        const element = document.getElementById(id);

        if (!element) return;

        const offset = 90;

        const top =
            element.getBoundingClientRect().top +
            window.scrollY -
            offset;

        window.scrollTo({
            top,
            behavior: "smooth"
        });

    }, []);

    return {
        scrollToSection
    };
}