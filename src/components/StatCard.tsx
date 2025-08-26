import { ReactNode } from 'react'

export interface StatCardProps {
    icon: ReactNode
    value: string
    label: string
    trend?: string
    trendColor?: string
    imageUrl?: string
}

export const StatCard = ({
    icon,
    value,
    label,
    trend,
    trendColor = 'text-green-500 bg-green-800',
    imageUrl,
}: StatCardProps) => {
    return (
        <div className="bg-[#19233c] text-white p-4 rounded-lg shadow-lg w-80">
            <div className="flex items-center mb-4">
                <div className="text-white mr-3">{icon}</div>
                <div>
                    <div className="text-3xl font-bold">{value}</div>
                    <div className="text-sm text-gray-400">{label}</div>
                </div>
            </div>

            {trend && (
                <div className={`text-sm px-2 py-0.5 rounded-full inline-block ${trendColor}`}>
                    {trend}
                </div>
            )}

            {imageUrl && (
                <div className="mt-4">
                    <img
                        src={imageUrl}
                        alt="Stat chart"
                        className="w-full h-20 object-cover"
                    />
                </div>
            )}
        </div>
    )
}
