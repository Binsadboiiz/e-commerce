import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantityControl({ value, min = 1, max = 999, onChange, disabled = false }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDecrease = async () => {
        if (value <= min || disabled || isUpdating) return;
        setIsUpdating(true);
        try {
            await onChange(value - 1);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleIncrease = async () => {
        if (value >= max || disabled || isUpdating) return;
        setIsUpdating(true);
        try {
            await onChange(value + 1);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleInputChange = async (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (raw === '') return;
        let num = parseInt(raw, 10);
        if (num < min) num = min;
        if (num > max) num = max;
        setIsUpdating(true);
        try {
            await onChange(num);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-center border border-border rounded-md overflow-hidden select-none">
            <button
                onClick={handleDecrease}
                disabled={value <= min || disabled || isUpdating}
                className="w-8 h-8 flex items-center justify-center text-text-secondary
                           hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
            >
                <FiMinus size={14} />
            </button>

            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                disabled={disabled || isUpdating}
                className="w-10 h-8 text-center text-sm font-medium border-x border-border
                           bg-white focus:bg-primary/5 transition-colors disabled:opacity-50"
                aria-label="Quantity"
            />

            <button
                onClick={handleIncrease}
                disabled={value >= max || disabled || isUpdating}
                className="w-8 h-8 flex items-center justify-center text-text-secondary
                           hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
            >
                <FiPlus size={14} />
            </button>
        </div>
    );
}
