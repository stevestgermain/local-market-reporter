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
    <div className="bg-white dark:bg-black p-3 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-colors group h-full">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        {trend && (
           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
             trend === 'Growing' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
             trend === 'Declining' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
             'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
           }`}>
             {trend}
           </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</div>
      {subLabel && <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{subLabel}</div>}
    </div>
  );
};

interface DemographicBarProps {
  label: string;
  percentage: number;
  colorClass?: string;
}

export const DemographicBar: React.FC<DemographicBarProps> = ({ label, percentage, colorClass = "bg-blue-500 dark:bg-blue-400" }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
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
        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{title}</span>
      </div>
      {onClick && (
        <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-xs transition-colors">
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
  <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 rounded-lg mr-2 mb-2 transition-colors">
    {text}
  </span>
);

export const UtilityButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
  return (
    <button 
      className={`px-2.5 py-1.5 text-[11px] font-semibold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
