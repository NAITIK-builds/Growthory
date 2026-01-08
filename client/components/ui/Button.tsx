import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-[#3d522b] text-white hover:bg-[#2d3d20] focus:ring-[#3d522b] shadow-lg shadow-[#3d522b]/20 hover:shadow-xl hover:shadow-[#3d522b]/30 active:scale-[0.98] transition-all duration-300',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-[#3d522b] active:scale-[0.98] transition-all',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98] transition-all',
        outline: 'border-2 border-[#3d522b] bg-transparent hover:bg-[#3d522b] hover:text-white text-[#3d522b] active:scale-[0.98] transition-all'
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg'
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
