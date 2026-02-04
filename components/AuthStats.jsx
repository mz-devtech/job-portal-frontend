import React from 'react';
import { Briefcase, Building, Zap } from 'lucide-react';

const AuthStats = () => {
  const stats = [
    { 
      value: '1,75,324', 
      label: 'Live Job', 
      icon: <Zap className="w-5 h-5" />,
    },
    { 
      value: '97,354', 
      label: 'Companies', 
      icon: <Building className="w-5 h-5" />,
    },
    { 
      value: '7,532', 
      label: 'New Jobs', 
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-light leading-tight text-white mb-6">
        Over 1,75,324 candidates <br /> waiting for good employees.
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-lg bg-white/10 backdrop-blur-sm mb-3 mx-auto">
              {stat.icon}
            </div>
            <div className="text-xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-200 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthStats;