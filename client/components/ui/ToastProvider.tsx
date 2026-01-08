"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, duration);
        }
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        showToast('success', message, duration);
    }, [showToast]);

    const error = useCallback((message: string, duration?: number) => {
        showToast('error', message, duration);
    }, [showToast]);

    const info = useCallback((message: string, duration?: number) => {
        showToast('info', message, duration);
    }, [showToast]);

    const warning = useCallback((message: string, duration?: number) => {
        showToast('warning', message, duration);
    }, [showToast]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-white',
                    border: 'border-[#3d522b]',
                    text: 'text-slate-900',
                    icon: CheckCircle2,
                    iconColor: 'text-[#3d522b]',
                    iconBg: 'bg-[#3d522b]/10',
                    iconBorder: 'border-[#3d522b]',
                    progressBg: 'bg-[#3d522b]'
                };
            case 'error':
                return {
                    bg: 'bg-white',
                    border: 'border-red-400',
                    text: 'text-slate-900',
                    icon: AlertCircle,
                    iconColor: 'text-red-500',
                    iconBg: 'bg-red-50',
                    iconBorder: 'border-red-400',
                    progressBg: 'bg-red-500'
                };
            case 'warning':
                return {
                    bg: 'bg-white',
                    border: 'border-amber-400',
                    text: 'text-slate-900',
                    icon: AlertCircle,
                    iconColor: 'text-amber-500',
                    iconBg: 'bg-amber-50',
                    iconBorder: 'border-amber-400',
                    progressBg: 'bg-amber-500'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-white',
                    border: 'border-slate-300',
                    text: 'text-slate-900',
                    icon: Info,
                    iconColor: 'text-slate-500',
                    iconBg: 'bg-slate-50',
                    iconBorder: 'border-slate-300',
                    progressBg: 'bg-slate-500'
                };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Container - Fixed position bottom right */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
                {toasts.map((toast) => {
                    const styles = getToastStyles(toast.type);
                    const Icon = styles.icon;

                    return (
                        <div
                            key={toast.id}
                            className={`${styles.bg} ${styles.border} border-2 rounded-[2rem] shadow-2xl p-4 pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-500 relative overflow-hidden`}
                        >
                            <div className="flex items-center gap-4 pr-10">
                                {/* Icon */}
                                <div className={`h-10 w-10 rounded-2xl ${styles.iconBg} border-2 ${styles.iconBorder} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                                    <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                                </div>

                                {/* Message */}
                                <p className={`text-sm font-black leading-tight flex-1 ${styles.text}`}>
                                    {toast.message}
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl transition-all"
                                    aria-label="Close notification"
                                >
                                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                </button>
                            </div>

                            {/* Progress bar */}
                            {toast.duration && toast.duration > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden rounded-b-[2rem]">
                                    <div
                                        className={`h-full ${styles.progressBg}`}
                                        style={{
                                            animation: `shrinkWidth ${toast.duration}ms linear forwards`
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
                @keyframes shrinkWidth {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
