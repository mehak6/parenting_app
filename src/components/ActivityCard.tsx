'use client';

import React from 'react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  pickingDate?: string | null;
  onToggleFavorite: () => void;
  onSchedule?: (date: string) => void;
  onComplete?: () => void;
  onSkip?: () => void;
  onRemix?: (type: 'Easier' | 'Harder' | 'NoMaterials') => void;
  onClose: () => void;
}

export default function ActivityCard({ 
  activity, 
  isFavorite, 
  pickingDate,
  onToggleFavorite, 
  onSchedule,
  onComplete,
  onSkip,
  onRemix,
  onClose 
}: ActivityCardProps) {
  const [showRemix, setShowRemix] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-28">
        <div className="relative h-48 bg-blue-600 flex items-center justify-center text-8xl">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-sm z-10"
            title="Go Home"
          >
            🏠
          </button>
          
          {activity.moods.includes('Creative') ? '🎨' : 
           activity.moods.includes('Active') ? '🏃' : 
           activity.moods.includes('Learning') ? '🧠' : '✨'}
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={onToggleFavorite}
              className="w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-sm transition-transform active:scale-95"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 -mt-8 bg-white rounded-t-3xl relative space-y-6">
          {onSkip && !pickingDate && (
            <div className="flex justify-end -mt-12 mb-4 relative z-20">
               <button 
                onClick={onSkip}
                className="bg-white text-gray-500 hover:text-blue-600 px-4 py-2 rounded-full shadow-md text-sm font-bold flex items-center gap-2 border border-gray-100 transition-all active:scale-95"
              >
                <span>🔄</span> Skip / Next Idea
              </button>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text pb-1">{activity.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {activity.timeRequired}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {activity.parentEnergy} Effort
              </span>
              {activity.isLowEnergy && (
                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Tired Mode Friendly
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              <span>📦</span> Materials Needed
            </h3>
            <ul className="grid grid-cols-1 gap-2">
              {activity.materials.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-gray-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
              <span>📝</span> Instructions
            </h3>
            <ol className="space-y-4">
              {activity.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {activity.proTip && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3 items-start">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-bold text-yellow-800 text-sm uppercase tracking-wide">Parenting Pro Tip</h4>
                <p className="text-yellow-900 text-sm leading-relaxed mt-1">{activity.proTip}</p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Focus Skills</h3>
            <div className="flex flex-wrap gap-2">
              {activity.skillFocus.map((skill, idx) => (
                <span key={idx} className="text-sm text-gray-600">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
          
          {onRemix && !pickingDate && (
            <div className="flex justify-center gap-2 mb-3">
              <button onClick={() => onRemix('Easier')} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200">
                Baby Steps (Easier)
              </button>
              <button onClick={() => onRemix('Harder')} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200">
                Level Up (Harder)
              </button>
              <button onClick={() => onRemix('NoMaterials')} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200">
                No Supplies?
              </button>
            </div>
          )}

          {pickingDate && onSchedule ? (
            <button
              onClick={() => onSchedule(pickingDate)}
              className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <span>📅</span> Schedule for {pickingDate}
            </button>
          ) : (
            <button
              onClick={() => {
                if (onComplete) onComplete();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transform active:scale-95 transition-all"
            >
              I'm Done! 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}