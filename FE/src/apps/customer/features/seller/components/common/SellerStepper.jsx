import React from 'react';
import styles from './SellerStepper.module.css';

export default function SellerStepper({ 
    steps = [], 
    currentStepIndex = 0,
    maxAccessibleStepIndex = 0,
    onStepClick
}) {
    const progressPercent = steps.length > 1 
        ? (maxAccessibleStepIndex / (steps.length - 1)) * 100 
        : 0;

    return (
        <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
                {/* Background Progress Lines */}
                <div className={styles.progressLine} />
                <div 
                    className={styles.progressLineActive} 
                    style={{ width: `calc(${progressPercent}% - ${progressPercent * 0.8}px)` }} 
                />

                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < maxAccessibleStepIndex;
                    const isClickable = index <= maxAccessibleStepIndex;

                    let circleClass = styles.circle;
                    if (isActive) {
                        circleClass += ` ${styles.activeCircle}`;
                    } else if (isCompleted) {
                        circleClass += ` ${styles.completedCircle}`;
                    }

                    let labelClass = styles.stepLabel;
                    if (isActive) {
                        labelClass += ` ${styles.activeLabel}`;
                    } else if (isCompleted) {
                        labelClass += ` ${styles.completedLabel}`;
                    }

                    return (
                        <div 
                            key={step.key} 
                            className={`${styles.stepNode} ${isClickable ? styles.clickable : ''}`}
                            onClick={() => isClickable && onStepClick?.(index)}
                        >
                            <div className={circleClass}>
                                {isCompleted && !isActive ? '✓' : index + 1}
                            </div>
                            <span className={labelClass}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}