'use client';

import React, { useState } from 'react';
import { Mood, ParentEnergy, TimeAvailable } from '../types';

interface ActivityEngineProps {
  onSuggest: (mood: Mood, energy: ParentEnergy) => void;
  onTiredMode: () => void;
}

const moods: { label: string; value: Mood; icon: string }[] = [
  { label: 'Active', value: 'Active', icon: '🏃' },
  { label: 'Calm', value: 'Calm', icon: '🧘' },
  { label: 'Restless', value: 'Restless', icon: '😫' },
  { label: 'Learning', value: 'Learning', icon: '🧠' },
  { label: 'Creative', value: 'Creative', icon: '🎨' },
  { label: 'Social', value: 'Social', icon: '👥' },
];

const energies: { label: string; value: ParentEnergy; icon: string }[] = [
  { label: 'Very Low', value: 'Low', icon: '🪫' },
  { label: 'Medium', value: 'Medium', icon: '⚡' },
  { label: 'High', value: 'High', icon: '🔥' },
];

export default function ActivityEngine({ onSuggest, onTiredMode }: ActivityEngineProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<Mood | null>(null);

  const handleMoodSelect = (m: Mood) => {
    setMood(m);
    setStep(2);
  };

  const handleEnergySelect = (e: ParentEnergy) => {
    if (mood) {
      onSuggest(mood, e);
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-8">
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-2">
            <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text pb-1">
              How is your child feeling?
            </h2>
            <p className="text-gray-500">Select their current mood.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodSelect(m.value)}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all space-y-2 shadow-sm"
              >
                <span className="text-4xl">{m.icon}</span>
                <span className="font-medium text-gray-700">{m.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onTiredMode}
            className="w-full mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 font-semibold flex items-center justify-center gap-2"
          >
            <span>🥱</span> I'm too tired to move
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button onClick={() => setStep(1)} className="text-blue-600 font-medium flex items-center gap-1">← <span className="text-sm">Back</span></button>
          <div className="space-y-2">
            <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text pb-1">
              What's your energy level?
            </h2>
            <p className="text-gray-500">Be honest - we have ideas for every level.</p>
          </div>
          <div className="flex flex-col gap-4">
            {energies.map((e) => (
              <button
                key={e.value}
                onClick={() => handleEnergySelect(e.value)}
                className="flex items-center p-6 rounded-2xl border border-gray-100 bg-white/80 hover:border-blue-200 hover:bg-blue-50 transition-all gap-6 shadow-sm"
              >
                <span className="text-4xl">{e.icon}</span>
                <div className="text-left">
                  <span className="block font-bold text-lg text-gray-800">{e.label}</span>
                  <span className="text-sm text-gray-500">
                    {e.value === 'Low' ? 'I need to sit or lie down' : e.value === 'Medium' ? 'I can supervise' : 'I can join the play'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}