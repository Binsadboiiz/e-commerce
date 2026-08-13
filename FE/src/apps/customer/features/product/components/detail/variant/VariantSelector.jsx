import styles from './VariantSelector.module.css';

export default function VariantSelector({
    attributes = [],
    selectedAttributes = {},
    onSelect,
}) {
    return (
        <div className={styles.wrapper}>
            {attributes.map((attribute) => (
                <div key={attribute.attributeId}>
                    <h3 className={styles.title}>
                        {attribute.attributeName}
                    </h3>
                    <div className={styles.options}>
                        {attribute.attributeValues.map((value) => {
                            const isSelected = selectedAttributes[attribute.attributeId] === value.valueId;

                            return (
                                <button
                                    key={value.valueId}
                                    type="button"
                                    onClick={() => onSelect(attribute.attributeId, value.valueId)}
                                    className={`${styles.button} ${isSelected ? styles.selected : styles.unselected}`}
                                >
                                    {value.value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}