import React from 'react';
import styles from './SellerStepper.module.css';

export default function SellerStepper({ 
    steps = [], 
    currentStepIndex = 0,
    maxAccessibleStepIndex = 0,
    onStepClick
}) {
    const totalSteps = steps.length;
    const activeLinePercent = totalSteps > 1 
        ? (currentStepIndex / (totalSteps - 1)) * 100 
        : 0;

    const lineInsetPercent = totalSteps > 0 ? 100 / (totalSteps * 2) : 0;

    return (
        <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
                {/* Background Line */}
                <div 
                    className={styles.progressLine} 
                    style={{ 
                        left: `${lineInsetPercent}%`, 
                        right: `${lineInsetPercent}%` 
                    }} 
                />
                
                {/* Active Progress Line */}
                <div 
                    className={styles.progressLineActive} 
                    style={{ 
                        left: `${lineInsetPercent}%`, 
                        width: `calc(${activeLinePercent}% * (100% - ${lineInsetPercent * 2}%) / 100)` 
                    }} 
                />

                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex || (index <= maxAccessibleStepIndex && !isActive && currentStepIndex > index);
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
                            key={step.key || index} 
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