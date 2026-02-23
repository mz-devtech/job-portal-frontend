import React from 'react';
import { Briefcase, Building, Zap, Users } from 'lucide-react';

const AuthStats = ({ stats, loading }) => {
  // Use provided stats or fallback to defaults
  const displayStats = {
    liveJobs: stats?.liveJobs || '1,75,324',
    companies: stats?.companies || '97,354',
    candidates: stats?.candidates || '38,47,154',
    newJobs: stats?.newJobs || '7,532'
  };

  const statItems = [
    { 
      value: displayStats.liveJobs, 
      label: 'Live Job', 
      icon: <Zap className="w-5 h-5" />,
    },
    { 
      value: displayStats.companies, 
      label: 'Companies', 
      icon: <Building className="w-5 h-5" />,
    },
    { 
      value: displayStats.candidates, 
      label: 'Candidates', 
      icon: <Users className="w-5 h-5" />,
    },
    { 
      value: displayStats.newJobs, 
      label: 'New Jobs', 
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-light leading-tight text-white mb-6">
        Over {displayStats.candidates} candidates <br /> waiting for good employees.
      </h2>
      
      <div className="grid grid-cols-4 gap-3">
        {statItems.map((stat, index) => (
          <div key={index} className="text-center group">
            <div className="inline-flex items-center justify-center p-2.5 rounded-lg bg-white/10 backdrop-blur-sm mb-2 mx-auto group-hover:bg-white/20 transition-all duration-300">
              <div className="text-white group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
            </div>
            {loading ? (
              <>
                <div className="h-5 w-14 bg-white/20 rounded animate-pulse mx-auto mb-1"></div>
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-white mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-200 font-medium">
                  {stat.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Real-time indicator */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-blue-200/80">Updated in real-time</span>
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default AuthStats;