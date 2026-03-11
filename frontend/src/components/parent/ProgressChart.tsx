'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
    area: string;
    current: number; // 0-100
    expected: number; // 0-100
    trend?: 'up' | 'down' | 'stable';
}

export default function ProgressChart({ area, current, expected, trend = 'stable' }: ProgressChartProps) {
    const data = [
        { name: 'Esperado', value: expected, color: '#94A3B8' }, // Gray
        { name: 'Actual', value: current, color: current >= expected ? '#10B981' : '#F59E0B' } // Green if above, Yellow if below
    ];

    const getPerformanceText = () => {
        const diff = current - expected;
        if (diff >= 20) return { text: '¡Excelente!', emoji: '🎉', color: 'text-green-600' };
        if (diff >= 10) return { text: '¡Muy bien!', emoji: '✅', color: 'text-green-600' };
        if (diff >= 0) return { text: 'Bien', emoji: '👍', color: 'text-blue-600' };
        if (diff >= -10) return { text: 'Puede mejorar', emoji: '💪', color: 'text-yellow-600' };
        return { text: 'Necesita práctica', emoji: '📚', color: 'text-orange-600' };
    };

    const performance = getPerformanceText();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{area}</h3>
                    <div className={`flex items-center gap-2 mt-1 ${performance.color}`}>
                        <span className="text-2xl">{performance.emoji}</span>
                        <span className="font-semibold text-sm">{performance.text}</span>
                    </div>
                </div>
                {trend && (
                    <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-600' :
                            trend === 'down' ? 'bg-red-100 text-red-600' :
                                'bg-gray-100 text-gray-600'
                        }`}>
                        {trend === 'up' && <TrendingUp className="w-5 h-5" />}
                        {trend === 'down' && <TrendingDown className="w-5 h-5" />}
                        {trend === 'stable' && <Minus className="w-5 h-5" />}
                    </div>
                )}
            </div>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Score Display */}
            <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">Nivel actual:</span>
                <span className={`font-bold text-xl ${current >= expected ? 'text-green-600' : 'text-yellow-600'}`}>
                    {current}%
                </span>
            </div>
        </div>
    );
}
