"use client";

import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-950 z-20">
                    <h2 className="text-2xl font-bold text-foreground">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    required?: boolean;
    options?: { value: string; label: string }[];
    textarea?: boolean;
}

export function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    options,
    textarea = false,
}: FormFieldProps) {
    const baseClasses = "w-full px-4 py-2 border-2 border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all duration-200 placeholder:text-muted-foreground";

    return (
        <div className="mb-4 text-left">
            <label className="block text-sm font-bold mb-2 text-foreground">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            {textarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={4}
                    className={baseClasses}
                />
            ) : options ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={baseClasses}
                >
                    <option value="">Seleccionar...</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={baseClasses}
                />
            )}
        </div>
    );
}
