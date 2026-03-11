import { cn } from "@/lib/utils";

interface DataPoint {
    label: string;
    value: number;
    color?: string;
}

export function BarChart({ data, height = 200, className }: { data: DataPoint[], height?: number, className?: string }) {
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <div className={cn("flex items-end justify-between gap-2 w-full", className)} style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full max-w-[40px] flex items-end justify-center group-hover:scale-105 transition-transform duration-300"
                        style={{ height: `${(d.value / max) * 100}%` }}
                    >
                        <div className={cn("w-full h-full rounded-t-lg opacity-85 group-hover:opacity-100 transition-opacity", d.color || "bg-blue-500")} />

                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none">
                            <span className="font-bold">{d.value}</span>
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium truncate w-full text-center">{d.label}</span>
                </div>
            ))}
        </div>
    );
}
