'use client';

import React, { useState } from 'react';
import { ChildProfile, AgeGroup } from '../types';

interface OnboardingProps {
  onComplete: (profile: ChildProfile) => void;
  onCancel?: () => void;
}

const ageGroups: { label: string; value: AgeGroup; desc: string }[] = [
  { label: 'Tiny Steps', value: '12-24m', desc: '12-24 Months' },
  { label: 'Play Buddies', value: '2-3y', desc: '2-3 Years' },
  { label: 'Curious Cubs', value: '3-4y', desc: '3-4 Years' },
  { label: 'Little Thinkers', value: '4-5y', desc: '4-5 Years' },
  { label: 'Super Kids', value: '6+y', desc: '6+ Years' },
];

const avatars = ['🦁', '🐰', '🐻', '🦊', '🐸', '🦄', '🚀', '⭐'];

export default function Onboarding({ onComplete, onCancel }: OnboardingProps) {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('2-3y');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: ChildProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      dob: new Date().toISOString(),
      ageGroup,
      language,
      avatar: selectedAvatar,
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 p-4 relative">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative">
        
        {/* Header Section */}
        <div className="bg-blue-50 p-8 text-center border-b border-blue-100 relative">
          {onCancel && (
            <button 
              onClick={onCancel}
              className="absolute top-4 left-4 p-3 bg-white text-gray-600 hover:text-blue-600 rounded-full shadow-md z-10 transition-all border border-gray-100"
              title="Go Back"
            >
              ←
            </button>
          )}
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl shadow-inner mb-4 border-4 border-white">
            {selectedAvatar}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Let&apos;s set up your profile</h1>
          <p className="text-gray-500 text-sm mt-1">Personalize your parenting companion</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choose an Avatar</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-between">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                    selectedAvatar === av
                      ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Child&apos;s Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="e.g. AARAV"
              className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-lg text-black uppercase placeholder-gray-400"
            />
          </div>

          {/* Age Group */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age Group</label>
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  type="button"
                  onClick={() => setAgeGroup(group.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                    ageGroup === group.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-bold text-sm">{group.label}</div>
                  <div className="text-xs opacity-70">{group.desc}</div>
                  {ageGroup === group.value && (
                    <div className="absolute top-2 right-2 text-blue-500">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Language</label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                    language === lang
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Playing ✨
          </button>
        </form>
      </div>
    </div>
  );
}