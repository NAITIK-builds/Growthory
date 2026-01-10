"use client";
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'light' | 'dark';
    fullScreen?: boolean;
    message?: string;
}

export default function LoadingSpinner({
    size = 'md',
    variant = 'primary',
    fullScreen = false,
    message
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
        xl: 'h-24 w-24'
    };

    const dotSizeClasses = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2.5 w-2.5',
        lg: 'h-4 w-4',
        xl: 'h-6 w-6'
    };

    const variantClasses = {
        primary: 'bg-[#3d522b]',
        light: 'bg-white',
        dark: 'bg-slate-900'
    };

    const LoadingContent = () => (
        <div className="flex flex-col items-center justify-center gap-6">
            {/* Orbital Spinner */}
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Center dot */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dotSizeClasses[size]} ${variantClasses[variant]} rounded-full animate-pulse`} />

                {/* Orbiting dots */}
                <div className="absolute inset-0 animate-spin-slow">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${variantClasses[variant]} rounded-full opacity-80`} />
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.2s' }}>
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${variantClasses[variant]} rounded-full opacity-60`} />
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.4s' }}>
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} ${variantClasses[variant]} rounded-full opacity-40`} />
                </div>
            </div>

            {/* Loading message */}
            {message && (
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-[#f8faf7]/80 backdrop-blur-sm z-[999] flex items-center justify-center">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-200">
                    <LoadingContent />
                </div>
            </div>
        );
    }

    return <LoadingContent />;
}

// Alternative: Pulse Loader
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const dotSizes = {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-4 w-4'
    };

    const gapSizes = {
        sm: 'gap-1.5',
        md: 'gap-2',
        lg: 'gap-3'
    };

    return (
        <div className={`flex items-center ${gapSizes[size]}`}>
            <div className={`${dotSizes[size]} bg-[#3d522b] rounded-full animate-bounce`} style={{ animationDelay: '0s' }} />
            <div className={`${dotSizes[size]} bg-[#3d522b] rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }} />
            <div className={`${dotSizes[size]} bg-[#3d522b] rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
        </div>
    );
}

// Alternative: Gradient Ring Loader
export function RingLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
    const sizeClasses = {
        sm: 'h-8 w-8 border-2',
        md: 'h-12 w-12 border-3',
        lg: 'h-16 w-16 border-4',
        xl: 'h-24 w-24 border-[6px]'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-slate-200 border-t-[#3d522b] animate-spin`} />
    );
}

// Alternative: Ecosystem Nodes Loader (themed for Growthory)
export function EcosystemLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const containerSizes = {
        sm: 'h-12 w-12',
        md: 'h-20 w-20',
        lg: 'h-32 w-32'
    };

    const nodeSizes = {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-5 w-5'
    };

    return (
        <div className={`relative ${containerSizes[size]}`}>
            {/* Center node */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${nodeSizes[size]} bg-[#3d522b] rounded-full shadow-lg shadow-[#3d522b]/30 animate-pulse`} />

            {/* Connecting nodes */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div
                    key={i}
                    className="absolute inset-0 animate-spin-slow"
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        transform: `rotate(${angle}deg)`
                    }}
                >
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${nodeSizes[size]} bg-[#606c38] rounded-full opacity-70`} />
                </div>
            ))}
        </div>
    );
}
