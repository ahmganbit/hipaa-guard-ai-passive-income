import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'purple',
  className = '' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return 'from-purple-500 to-blue-500';
      case 'green':
        return 'from-emerald-500 to-teal-500';
      case 'orange':
        return 'from-orange-500 to-red-500';
      case 'blue':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses()} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${
            trend > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
};

export default StatsCard; 