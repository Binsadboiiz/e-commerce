import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './SellerStepper.module.css';

/**
 * Universal Stepper Component
 * Standardized progress bar component for multi-step onboarding and lifecycle timelines.
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step items { key, label, status?, icon? }
 * @param {number} [props.currentStepIndex=0] - 0-indexed current active step
 * @param {number} [props.maxAccessibleStepIndex=0] - Maximum step index permitted for interaction
 * @param {Function} [props.onStepClick] - Callback when an accessible step node is clicked
 * @param {string} [props.maxWidth] - Optional max-width constraint for container (e.g. "520px")
 * @param {string} [props.className] - Optional custom CSS class for container
 */
export default function SellerStepper({ 
    steps = [], 
    currentStepIndex = 0,
    maxAccessibleStepIndex = 0,
    onStepClick,
    maxWidth,
    className = ""
}) {
    const totalSteps = steps.length;
    
    // Determine effective active step index (supports explicit status in steps or currentStepIndex)
    let effectiveStepIndex = currentStepIndex;
    if (steps.length > 0) {
        let lastActiveOrCompletedIdx = -1;
        for (let i = steps.length - 1; i >= 0; i--) {
            if (steps[i].status === 'active' || steps[i].status === 'completed') {
                lastActiveOrCompletedIdx = i;
                break;
            }
        }
        if (lastActiveOrCompletedIdx > effectiveStepIndex) {
            effectiveStepIndex = lastActiveOrCompletedIdx;
        }
    }

    const clampedIndex = totalSteps > 1 
        ? Math.max(0, Math.min(effectiveStepIndex, totalSteps - 1)) 
        : 0;

    const lineInsetPercent = totalSteps > 0 ? 100 / (totalSteps * 2) : 0;
    const activeLineWidthPercent = totalSteps > 1 
        ? (clampedIndex * 100) / totalSteps 
        : 0;

    return (
        <div 
            className={`${styles.stepperContainer} ${className}`}
            style={maxWidth ? { maxWidth } : undefined}
        >
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
                        width: `${activeLineWidthPercent}%` 
                    }} 
                />

                {steps.map((step, index) => {
                    const hasExplicitStatus = Boolean(step.status);
                    const isExplicitCompleted = step.status === "completed";
                    const isExplicitRejected = step.status === "rejected";
                    const isExplicitActive = step.status === "active";

                    const isActive = hasExplicitStatus
                        ? isExplicitActive
                        : index === currentStepIndex;

                    const isCompleted = hasExplicitStatus
                        ? isExplicitCompleted
                        : (index < currentStepIndex || (index <= maxAccessibleStepIndex && !isActive && currentStepIndex > index));

                    const isRejected = hasExplicitStatus && isExplicitRejected;
                    const isClickable = Boolean(onStepClick && index <= maxAccessibleStepIndex);

                    let circleClass = styles.circle;
                    if (isRejected) {
                        circleClass += ` ${styles.rejectedCircle}`;
                    } else if (isActive) {
                        circleClass += ` ${styles.activeCircle}`;
                    } else if (isCompleted) {
                        circleClass += ` ${styles.completedCircle}`;
                    }

                    let labelClass = styles.stepLabel;
                    if (isRejected) {
                        labelClass += ` ${styles.rejectedLabel}`;
                    } else if (isActive) {
                        labelClass += ` ${styles.activeLabel}`;
                    } else if (isCompleted) {
                        labelClass += ` ${styles.completedLabel}`;
                    }

                    // Content inside the circle node
                    let circleContent;
                    if (step.icon) {
                        circleContent = step.icon;
                    } else if (isRejected) {
                        circleContent = <FiX size={16} strokeWidth={2.5} />;
                    } else if (isCompleted) {
                        circleContent = <FiCheck size={16} strokeWidth={2.5} />;
                    } else {
                        circleContent = index + 1;
                    }

                    return (
                        <div 
                            key={step.key || index} 
                            className={`${styles.stepNode} ${isClickable ? styles.clickable : ''}`}
                            onClick={() => isClickable && onStepClick?.(index)}
                        >
                            <div className={circleClass}>
                                {circleContent}
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