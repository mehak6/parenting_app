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

  const getImage = (act: Activity) => {
    const mat = act.materials[0]?.toLowerCase() || '';
    const name = act.name.toLowerCase();
    
    if (mat.includes('balloon')) return 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&w=800&q=80';
    if (mat.includes('crayon') || mat.includes('paper') || mat.includes('marker')) return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80';
    if (mat.includes('tape') || name.includes('tape')) return 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&w=800&q=80'; // Reusing balloon/party vibe or find tape specific
    if (mat.includes('box') || mat.includes('cardboard')) return 'https://images.unsplash.com/photo-1587654780291-39c940483731?auto=format&fit=crop&w=800&q=80';
    if (mat.includes('cup')) return 'https://images.unsplash.com/photo-1610847035973-c6eb495e2e8e?auto=format&fit=crop&w=800&q=80'; // Cups/party
    if (mat.includes('sock')) return 'https://images.unsplash.com/photo-1517677208171-0bc5e2e3b6bd?auto=format&fit=crop&w=800&q=80'; // Clothes/texture
    if (mat.includes('pillow') || name.includes('fort')) return 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'; // Cozy
    if (mat.includes('cards')) return 'https://images.unsplash.com/photo-1605218427306-6354d4315320?auto=format&fit=crop&w=800&q=80'; // Cards
    if (mat.includes('dice')) return 'https://images.unsplash.com/photo-1595757816291-ab4c1cba0f07?auto=format&fit=crop&w=800&q=80'; // Dice
    if (act.moods.includes('Active')) return 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80';
    
    return 'https://images.unsplash.com/photo-1502086223501-686db63fbff4?auto=format&fit=crop&w=800&q=80'; // Default kids playing
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-28">
        
        {/* Dynamic Image Header */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <img 
            src={getImage(activity)}
            alt={activity.name}
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-md z-10 hover:bg-black/40 transition-all active:scale-95"
            title="Go Home"
          >
            🏠
          </button>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={onToggleFavorite}
              className="w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-md transition-transform active:scale-95 hover:bg-black/40"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-black/20 rounded-full text-white flex items-center justify-center text-xl backdrop-blur-md hover:bg-black/40"
            >
              ✕
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
             <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">{activity.name}</h2>
          </div>
        </div>

        <div className="p-6 bg-white relative space-y-6">
          <div className="space-y-2">
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
                <li key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-gray-700 border border-gray-100">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
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
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
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
                <span key={idx} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          
          {onRemix && !pickingDate && (
            <div className="flex justify-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => onRemix('Easier')} className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all">
                Baby Steps (Easier)
              </button>
              <button onClick={() => onRemix('Harder')} className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all">
                Level Up (Harder)
              </button>
              <button onClick={() => onRemix('NoMaterials')} className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all">
                No Supplies?
              </button>
            </div>
          )}

          {pickingDate && onSchedule ? (
            <button
              onClick={() => onSchedule(pickingDate)}
              className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>📅</span> Schedule for {pickingDate}
            </button>
          ) : (
            <div className="flex gap-2">
               {onSkip && (
                 <button 
                  onClick={onSkip}
                  className="w-16 h-14 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center text-2xl active:scale-90 transition-all border border-gray-200"
                  title="Next Idea"
                 >
                   🔄
                 </button>
               )}
               <button
                onClick={() => {
                  if (onComplete) onComplete();
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                I'm Done! 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
