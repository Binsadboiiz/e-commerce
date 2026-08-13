import styles from "./ProductSectionNav.module.css";

export default function ProductSectionNav({
    sections,
    activeSection,
    onNavigate,
    isVisible
}) {

    return (
        <nav className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden}`}>

            <div className={styles.inner}>

                {sections.map(section => (

                    <button
                        key={section.id}
                        type="button"
                        className={`${styles.tab} ${
                            activeSection === section.id
                                ? styles.active
                                : ""
                        }`}
                        onClick={() => onNavigate(section.id)}
                    >
                        {section.label}
                    </button>

                ))}

            </div>

        </nav>
    );
}