import { Trophy, Star, Zap } from 'lucide-react';

interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    icon?: 'trophy' | 'star' | 'zap' | 'none';
    color?: 'green' | 'blue' | 'purple' | 'orange' | 'yellow';
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Barra de Progreso Visual con Iconos
 * Del PDF cliente: "Progreso con barras visuales, no solo números"
 */
export default function ProgressBar({
    progress,
    label,
    showPercentage = false,
    icon = 'star',
    color = 'green',
    size = 'md'
}: ProgressBarProps) {
    // Clamp progress entre 0-100
    const clampedProgress = Math.min(100, Math.max(0, progress));

    // Color mapping usando BestKids palette
    const colorClasses = {
        green: 'bg-gradient-to-r from-bestkids-green to-green-400',
        blue: 'bg-gradient-to-r from-bestkids-blue to-blue-400',
        purple: 'bg-gradient-to-r from-bestkids-purple to-purple-400',
        orange: 'bg-gradient-to-r from-bestkids-orange to-orange-400',
        yellow: 'bg-gradient-to-r from-bestkids-yellow to-yellow-400',
    };

    // Size mapping
    const sizeClasses = {
        sm: 'h-4',
        md: 'h-8',
        lg: 'h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    // Icon component
    const IconComponent = () => {
        const iconClass = `${iconSizes[size]} ${clampedProgress === 100 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`;

        switch (icon) {
            case 'trophy':
                return <Trophy className={iconClass} />;
            case 'star':
                return <Star className={iconClass + (clampedProgress === 100 ? ' animate-pulse-grow' : '')} />;
            case 'zap':
                return <Zap className={iconClass} />;
            case 'none':
                return null;
            default:
                return <Star className={iconClass} />;
        }
    };

    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-body">
                        {label}
                    </span>
                    {showPercentage && (
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 font-title">
                            {Math.round(clampedProgress)}%
                        </span>
                    )}
                </div>
            )}

            {/* Progress Bar Container */}
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                {/* Progress Fill */}
                <div
                    className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                    style={{ width: `${clampedProgress}%` }}
                >
                    {/* Icon at end of bar */}
                    {icon !== 'none' && clampedProgress > 15 && (
                        <div className="drop-shadow-md">
                            <IconComponent />
                        </div>
                    )}
                </div>

                {/* Icon at end if bar too small */}
                {icon !== 'none' && clampedProgress <= 15 && clampedProgress > 0 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                            <IconComponent />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
