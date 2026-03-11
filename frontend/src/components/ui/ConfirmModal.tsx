"use client";

import { useState, useCallback, useContext, createContext, ReactNode } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    icon?: ReactNode;
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context.confirm;
}

interface ConfirmState extends ConfirmOptions {
    isOpen: boolean;
    resolve: ((value: boolean) => void) | null;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        message: "",
        resolve: null,
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                ...options,
                isOpen: true,
                resolve,
            });
        });
    }, []);

    const handleClose = (result: boolean) => {
        if (state.resolve) {
            state.resolve(result);
        }
        setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    };

    const variantStyles = {
        danger: {
            icon: <Trash2 className="w-6 h-6" />,
            iconBg: "bg-red-100 dark:bg-red-900/30",
            iconColor: "text-red-500",
            button: "bg-red-500 hover:bg-red-600 text-white",
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6" />,
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-500",
            button: "bg-amber-500 hover:bg-amber-600 text-white",
        },
        info: {
            icon: <AlertTriangle className="w-6 h-6" />,
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-500",
            button: "bg-blue-500 hover:bg-blue-600 text-white",
        },
    };

    const variant = state.variant || "danger";
    const styles = variantStyles[variant];

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Modal Overlay */}
            {state.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={() => handleClose(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="flex items-start gap-4 p-6 pb-4">
                            <div className={cn("p-3 rounded-2xl flex-shrink-0", styles.iconBg)}>
                                <div className={styles.iconColor}>
                                    {state.icon || styles.icon}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {state.title || "Confirmar acción"}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                    {state.message}
                                </p>
                            </div>
                            <button
                                onClick={() => handleClose(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 font-bold rounded-xl"
                                onClick={() => handleClose(false)}
                            >
                                {state.cancelText || "Cancelar"}
                            </Button>
                            <Button
                                className={cn("flex-1 h-12 font-bold rounded-xl", styles.button)}
                                onClick={() => handleClose(true)}
                            >
                                {state.confirmText || "Confirmar"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
