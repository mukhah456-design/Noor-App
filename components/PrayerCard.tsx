
import React from 'react';
import { getUrduName } from '../services/prayerService';

interface PrayerCardProps {
  name: string;
  time: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, isActive, icon }) => {
  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-between min-h-[160px] ${
      isActive ? 'prayer-active scale-105 z-10' : 'glass hover:bg-white/10'
    }`}>
      <div className={`mb-4 ${isActive ? 'text-white' : 'text-emerald-400'}`}>
        {icon}
      </div>
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {getUrduName(name)}
        </h3>
        <p className={`text-2xl font-mono tracking-wider ${isActive ? 'text-emerald-50' : 'text-white'}`}>
          {time}
        </p>
      </div>
      {isActive && (
        <div className="mt-2">
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white animate-pulse">
            جاری ہے
          </span>
        </div>
      )}
    </div>
  );
};

export default PrayerCard;
