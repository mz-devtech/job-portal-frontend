// components/AuthStats.tsx
import React from 'react';

const AuthStats = () => {
  const stats = [
    { value: '1,75,324', label: 'Live jobs', color: 'text-blue-200' },
    { value: '97,354', label: 'Companies', color: 'text-green-200' },
    { value: '7,532', label: 'New Jobs', color: 'text-purple-200' },
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Over 1,75,324 candidates waiting for good employees.
      </h2>
      
      <div className="grid grid-cols-3 gap-8 mt-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-4xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-200 text-sm font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthStats;