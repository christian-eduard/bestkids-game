import { cn } from "@/lib/utils";

export function DonutChart({
    value,
    total,
    color = "text-blue-500",
    size = 120,
    label = "",
    showPercentage = true,
    subLabel = ""
}: {
    value: number,
    total: number,
    color?: string,
    size?: number,
    label?: string,
    showPercentage?: boolean,
    subLabel?: string
}) {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    const strokeWidth = 8;
    const radius = 50 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", color)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {showPercentage && <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</span>}
                    {subLabel && <span className="text-xs text-gray-400 font-medium mt-0.5">{subLabel}</span>}
                </div>
            </div>
            {label && <span className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>}
        </div>
    )
}
