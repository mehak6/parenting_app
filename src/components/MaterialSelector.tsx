'use client';

import React from 'react';

interface MaterialSelectorProps {
  onSelectMaterial: (material: string) => void;
}

const materials = [
  { id: 'Balloon', label: 'Balloons', icon: '🎈', color: 'bg-pink-100' },
  { id: 'Dice', label: 'Dice', icon: '🎲', color: 'bg-purple-100' },
  { id: 'Box', label: 'Cardboard', icon: '📦', color: 'bg-orange-100' },
  { id: 'Paper', label: 'Books/Paper', icon: '📄', color: 'bg-blue-100' },
  { id: 'Tape', label: 'Tape', icon: '🩹', color: 'bg-green-100' },
  { id: 'Cups', label: 'Cups', icon: '🥤', color: 'bg-yellow-100' },
  { id: 'Socks', label: 'Socks', icon: '🧦', color: 'bg-red-100' },
  { id: 'Pillows', label: 'Pillows', icon: '🛋️', color: 'bg-indigo-100' },
  { id: 'Crayons', label: 'Crayons', icon: '🖍️', color: 'bg-teal-100' },
  { id: 'Toys', label: 'Toys', icon: '🧸', color: 'bg-amber-100' },
  { id: 'Stick', label: 'Stick', icon: '🥢', color: 'bg-gray-100' },
  { id: 'Music', label: 'Music', icon: '🎵', color: 'bg-rose-100' },
];

export default function MaterialSelector({ onSelectMaterial }: MaterialSelectorProps) {
  return (
    <div className="px-6 py-4">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Materials</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {materials.map((m) => {
          return (
            <button
              key={m.id}
              onClick={() => onSelectMaterial(m.id)}
              className="flex-shrink-0 w-32 h-40 rounded-2xl overflow-hidden border-2 border-transparent transition-all relative flex flex-col shadow-sm hover:scale-95 active:scale-90"
            >
              <div className={`flex-1 flex items-center justify-center text-5xl ${m.color}`}>
                {m.icon}
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-2 text-center">
                <span className="text-xs font-bold text-gray-700">{m.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}