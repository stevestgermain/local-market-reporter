import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBoxProps {
  label: string;
  value: string | number;
  trend?: 'Growing' | 'Stable' | 'Declining';
  subLabel?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, trend, subLabel }) => {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors group h-full">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</span>
        {trend && (
           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
             trend === 'Growing' ? 'bg-green-100 text-green-700' :
             trend === 'Declining' ? 'bg-red-100 text-red-700' :
             'bg-gray-100 text-gray-600'
           }`}>
             {trend}
           </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
      {subLabel && <div className="text-[10px] text-gray-400 mt-1">{subLabel}</div>}
    </div>
  );
};

interface DemographicBarProps {
  label: string;
  percentage: number;
  colorClass?: string;
}

export const DemographicBar: React.FC<DemographicBarProps> = ({ label, percentage, colorClass = "bg-blue-500" }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-500">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div 
        className={`h-full rounded-full ${colorClass}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  isOpen?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, onClick, isOpen }) => {
  return (
    <div 
      className={`flex items-center justify-between mb-3 mt-6 ${onClick ? 'cursor-pointer group' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{title}</span>
      </div>
      {onClick && (
        <span className="text-gray-400 group-hover:text-blue-600 text-xs transition-colors">
          {isOpen ? 'Collapse' : 'Expand'}
        </span>
      )}
    </div>
  );
};

interface TagProps {
  text: string;
}

export const Tag: React.FC<TagProps> = ({ text }) => (
  <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-lg mr-2 mb-2">
    {text}
  </span>
);

export const UtilityButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
  return (
    <button 
      className={`px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-gray-200 rounded-lg text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}