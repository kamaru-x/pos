"use client";

import React, { useState } from 'react'
import { workTypes } from "../../database";

const FitnessPage = () => {
    const [activeTab, setActiveTab] = useState<string>(workTypes[0]?.id || "1");
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto">
                    {workTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`px-5 py-2 rounded-lg whitespace-nowrap text-base transition-all font-semibold ${
                                activeTab === type.id
                                    ? "bg-gray-900 text-white shadow"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">Fitness (Tab: {activeTab})</div>
        </div>
    )
}

export default FitnessPage