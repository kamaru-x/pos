import React from 'react'

interface StatsCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
}

const StatsCard = ({ icon: Icon, title, value }: StatsCardProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="text-blue-600" size={28} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;