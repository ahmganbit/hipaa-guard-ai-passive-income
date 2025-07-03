import React from 'react';
import { Shield, Brain } from 'lucide-react';

const LoadingSpinner = ({ message = "Scanning..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Animated Shield */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/25">
          <Shield className="w-10 h-10 text-white animate-bounce" />
        </div>
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
      </div>
      
      {/* Scanning Text */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
        <p className="text-gray-400 text-sm">Analyzing document for HIPAA compliance...</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-64 bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-shimmer"></div>
      </div>
      
      {/* AI Processing Indicator */}
      <div className="flex items-center space-x-2 text-blue-400">
        <Brain className="w-4 h-4 animate-pulse" />
        <span className="text-sm">AI Processing</span>
      </div>
    </div>
  );
};

export default LoadingSpinner; 