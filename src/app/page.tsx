'use client';

import React, { useState, useEffect } from 'react';
import Onboarding from '../components/Onboarding';
import ActivityEngine from '../components/ActivityEngine';
import ActivityCard from '../components/ActivityCard';
import CalendarView from '../components/CalendarView';
import { ChildProfile, Mood, ParentEnergy, TimeAvailable, Activity, ScheduledActivity } from '../types';
import { activities } from '../data/activities';

import { generateActivity } from './actions';

export default function Home() {
    const [profiles, setProfiles] = useState<ChildProfile[]>([]);
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [view, setView] = useState<'home' | 'activity' | 'calendar' | 'onboarding'>('home');
    const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null);
    const [favorites, setFavorites] = useState<Activity[]>([]);
    const [history, setHistory] = useState<string[]>([]);
      
    // Calendar State
    const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
    const [pickingDate, setPickingDate] = useState<string | null>(null);
        
    // Skip Logic State
    const [lastRequest, setLastRequest] = useState<{mood: Mood, energy: ParentEnergy, time: TimeAvailable} | null>(null);
    
    // UI State
    const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
      
    useEffect(() => {
      const savedProfiles = localStorage.getItem('child_profiles');
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        setProfiles(parsed);
        if (parsed.length > 0) {
          setActiveProfileId(parsed[0].id);
        } else {
          setView('onboarding');
        }
      } else {
        // Fallback for migration: check for old single profile
        const oldProfile = localStorage.getItem('child_profile');
        if (oldProfile) {
          const parsed = JSON.parse(oldProfile);
          setProfiles([parsed]);
          setActiveProfileId(parsed.id);
          localStorage.setItem('child_profiles', JSON.stringify([parsed]));
        } else {
          setView('onboarding');
        }
      }

      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      const savedSchedule = localStorage.getItem('scheduled_activities');
      if (savedSchedule) {
        setScheduledActivities(JSON.parse(savedSchedule));
      }
      const savedHistory = localStorage.getItem('activity_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      setLoading(false);
    }, []);

    const activeProfile = profiles.find(p => p.id === activeProfileId) || null;
  
    const handleOnboardingComplete = (newProfile: ChildProfile) => {
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActiveProfileId(newProfile.id);
      localStorage.setItem('child_profiles', JSON.stringify(updatedProfiles));
      setView('home');
    };

    const updateHistory = (newId: string) => {
      setHistory(prev => {
        const updated = [...prev, newId];
        localStorage.setItem('activity_history', JSON.stringify(updated));
        return updated;
      });
    };
  
    const handleResetProfile = () => {
      setView('onboarding');
    };

  const toggleFavorite = (activity: Activity) => {
    const isFav = favorites.some(f => f.id === activity.id);
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(f => f.id !== activity.id);
    } else {
      newFavs = [...favorites, activity];
    }
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const handleScheduleActivity = (date: string) => {
    if (!suggestedActivity || !activeProfileId) return;
    
    const newSchedule: ScheduledActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityId: suggestedActivity.id,
      activityName: suggestedActivity.name,
      activityMoods: suggestedActivity.moods,
      date: date,
      completed: false,
      childId: activeProfileId
    };

    const updated = [...scheduledActivities, newSchedule];
    setScheduledActivities(updated);
    localStorage.setItem('scheduled_activities', JSON.stringify(updated));
    
    setPickingDate(null);
    setView('calendar');
  };

  const handleCompleteActivity = () => {
    if (!suggestedActivity || !activeProfileId) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newSchedule: ScheduledActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityId: suggestedActivity.id,
      activityName: suggestedActivity.name,
      activityMoods: suggestedActivity.moods,
      date: today,
      completed: true, // Marked as done immediately
      childId: activeProfileId
    };

    const updated = [...scheduledActivities, newSchedule];
    setScheduledActivities(updated);
    localStorage.setItem('scheduled_activities', JSON.stringify(updated));
  };

  const toggleScheduleComplete = (id: string) => {
    const updated = scheduledActivities.map(sa => 
      sa.id === id ? { ...sa, completed: !sa.completed } : sa
    );
    setScheduledActivities(updated);
    localStorage.setItem('scheduled_activities', JSON.stringify(updated));
  };

  const getAgeRangeInMonths = (group: string): [number, number] => {
    switch (group) {
      case '18-24m': return [18, 24];
      case '2-3y': return [24, 36];
      case '3-4y': return [36, 48];
      case '4-6y': return [48, 72];
      case '6-10y': return [72, 120];
      default: return [0, 120];
    }
  };

  const handleQuickFilter = async (scenario: 'Travel' | 'Restaurant' | 'Rainy' | 'Meltdown') => {
    if (!activeProfile) return;
    
    // Define parameters for each scenario
    let mood: Mood = 'Calm';
    let energy: ParentEnergy = 'Low';
    let context = '';
    
    switch (scenario) {
      case 'Travel':
        mood = 'Calm';
        energy = 'Low';
        context = 'in a car or plane (seated, no loose items)';
        break;
      case 'Restaurant':
        mood = 'Calm'; 
        energy = 'Medium';
        context = 'at a restaurant table (quiet, contained)';
        break;
      case 'Rainy':
        mood = 'Creative';
        energy = 'Medium';
        context = 'indoors on a rainy day';
        break;
      case 'Meltdown':
        mood = 'Calm';
        energy = 'Low';
        context = 'to calm down a tantrum or meltdown';
        break;
    }

    const [minMonths, maxMonths] = getAgeRangeInMonths(activeProfile.ageGroup);

    // 1. Try Local Search with Context-Aware AND Age Filtering
    const filtered = activities.filter(a => {
      // Age Check: Activity overlap with child's age range
      // We check if the activity's age range overlaps with the child's age range
      const ageMatch = a.minAge <= maxMonths && a.maxAge >= minMonths;
      if (!ageMatch) return false;

      // Helper to check if activity allows this context
      const hasContext = (ctx: string) => a.context?.includes(ctx);

      if (scenario === 'Travel') {
        return hasContext('Car') || hasContext('Plane') || hasContext('Waiting Room');
      }
      
      if (scenario === 'Restaurant') {
        return hasContext('Restaurant') || hasContext('Waiting Room');
      }
      
      if (scenario === 'Rainy') {
        return hasContext('Home') && (a.moods.includes('Creative') || a.moods.includes('Learning'));
      }
      
      if (scenario === 'Meltdown') {
        return (hasContext('Home') || hasContext('Car')) && a.moods.includes('Calm') && a.isLowEnergy;
      }
      
      return false;
    });

    if (filtered.length > 0) {
      const selection = filtered[Math.floor(Math.random() * filtered.length)];
      setSuggestedActivity(selection);
      setView('activity');
      return;
    }

    // 2. Use AI with Context
    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({
          ageGroup: activeProfile.ageGroup,
          mood,
          energy,
          time: '15min+',
          context
        });

        if (aiActivity) {
          setSuggestedActivity(aiActivity);
          setView('activity');
        } else {
          alert("Could not generate a quick activity. Trying a random one!");
          const fallback = activities[Math.floor(Math.random() * activities.length)];
          setSuggestedActivity(fallback);
          setView('activity');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleSuggest = async (mood: Mood, energy: ParentEnergy, time: TimeAvailable = '15min+') => {
    if (!activeProfile) return;
    setLastRequest({ mood, energy, time }); 

    const [minMonths, maxMonths] = getAgeRangeInMonths(activeProfile.ageGroup);

    // 1. Try Local Search
    const filtered = activities.filter(a => {
      // Age Check
      const ageMatch = a.minAge <= maxMonths && a.maxAge >= minMonths;
      if (!ageMatch) return false;

      const moodMatch = a.moods.includes(mood);
      const energyMatch = energy === 'High' ? true : energy === 'Medium' ? a.parentEnergy !== 'High' : a.parentEnergy === 'Low';
      return moodMatch && energyMatch;
    });

    // 2. If Local found
    if (filtered.length > 0) {
      const unseen = filtered.filter(a => !history.includes(a.id));
      if (unseen.length > 0) {
        const selection = unseen[Math.floor(Math.random() * unseen.length)];
        setSuggestedActivity(selection);
        updateHistory(selection.id);
        setView('activity');
        return;
      }
    }

    // 3. If NO Local match, try AI
    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({
          ageGroup: activeProfile.ageGroup,
          mood,
          energy,
          time
        });

        if (aiActivity) {
          setSuggestedActivity(aiActivity);
          setView('activity');
        } else {
          alert("Could not generate a new activity. Trying a random fallback!");
          // Fallback also needs age filtering
          const ageAppropriate = activities.filter(a => a.minAge <= maxMonths && a.maxAge >= minMonths);
          const fallbackPool = ageAppropriate.length > 0 ? ageAppropriate : activities;
          
          const fallback = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
          setSuggestedActivity(fallback);
          setView('activity');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleSkip = () => {
    if (lastRequest) {
      handleSuggest(lastRequest.mood, lastRequest.energy, lastRequest.time);
    } else {
      // If no last request (e.g. random or tired mode), just pick a random one
      const random = activities[Math.floor(Math.random() * activities.length)];
      setSuggestedActivity(random);
    }
  };

  const handleTiredMode = () => {
    const tiredActivities = activities.filter(a => a.isLowEnergy);
    const unseen = tiredActivities.filter(a => !history.includes(a.id));
    
    let selection;
    if (unseen.length > 0) {
      selection = unseen[Math.floor(Math.random() * unseen.length)];
      updateHistory(selection.id);
    } else {
      selection = tiredActivities[Math.floor(Math.random() * tiredActivities.length)];
    }
    
    setSuggestedActivity(selection);
    setView('activity');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        onCancel={profiles.length > 0 ? () => setView('home') : undefined}
      />
    );
  }

  if (!activeProfile) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen relative">
      {generating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium animate-pulse">Dreaming up a new idea...</p>
        </div>
      )}

      {view === 'home' && (
        <>
          <header className="p-6 pb-2 border-b border-gray-100 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-50 relative">
            <div className="relative">
              <button 
                onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                className="flex items-center gap-3 hover:bg-white/80 p-2 rounded-2xl transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-blue-50 group-hover:border-blue-200">
                  {activeProfile.avatar || '👶'}
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    {activeProfile.name || 'Child'}
                    <span className={`text-xs text-gray-400 transition-transform duration-300 ${showProfileSwitcher ? 'rotate-180' : ''}`}>▼</span>
                  </h1>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Switch Profile</p>
                </div>
              </button>

              {/* Profile Switcher Dropdown */}
              {showProfileSwitcher && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/5" 
                    onClick={() => setShowProfileSwitcher(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 origin-top-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Select Child</p>
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveProfileId(p.id);
                          setShowProfileSwitcher(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          activeProfileId === p.id ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{p.avatar || '👶'}</span>
                        <div className="text-left">
                          <span className={`block font-bold text-sm ${activeProfileId === p.id ? 'text-blue-700' : 'text-gray-900'}`}>{p.name}</span>
                          <span className={`block text-xs ${activeProfileId === p.id ? 'text-blue-500' : 'text-gray-500'}`}>{p.ageGroup}</span>
                        </div>
                        {activeProfileId === p.id && <span className="ml-auto text-blue-600">✓</span>}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button
                      onClick={() => {
                        setView('onboarding');
                        setShowProfileSwitcher(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-blue-600 font-bold"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        +
                      </div>
                      <span>Add Another Child</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setView('calendar')}
                className="w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center shadow-sm"
                title="Open Calendar"
              >
                📅
              </button>
            </div>
          </header>

          {pickingDate && (
            <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
              <p className="text-green-800 text-sm font-medium">
                Picking activity for <span className="font-bold">{pickingDate}</span>
              </p>
              <button onClick={() => setPickingDate(null)} className="text-green-600 text-sm hover:underline">Cancel</button>
            </div>
          )}

          {favorites.length > 0 && (
            <div className="px-6 pt-4 pb-0">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Your Favorites</h2>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {favorites.map(fav => (
                  <button 
                    key={fav.id}
                    onClick={() => {
                      setSuggestedActivity(fav);
                      setView('activity');
                    }}
                    className="flex-shrink-0 w-40 p-3 rounded-xl border border-blue-100 bg-blue-50/50 text-left hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-xl mb-1">{fav.moods.includes('Active') ? '🏃' : '✨'}</div>
                    <div className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{fav.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Ideas Section */}
          <div className="px-6 pt-2 pb-0">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Ideas</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <button onClick={() => handleQuickFilter('Travel')} className="flex-shrink-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all flex items-center gap-2">
                <span className="text-xl">🚗</span> <span className="font-bold text-gray-700">Travel</span>
              </button>
              <button onClick={() => handleQuickFilter('Restaurant')} className="flex-shrink-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all flex items-center gap-2">
                <span className="text-xl">🍽️</span> <span className="font-bold text-gray-700">Restaurant</span>
              </button>
              <button onClick={() => handleQuickFilter('Rainy')} className="flex-shrink-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all flex items-center gap-2">
                <span className="text-xl">☔</span> <span className="font-bold text-gray-700">Rainy Day</span>
              </button>
              <button onClick={() => handleQuickFilter('Meltdown')} className="flex-shrink-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-300 transition-all flex items-center gap-2">
                <span className="text-xl">🤯</span> <span className="font-bold text-gray-700">Meltdown</span>
              </button>
            </div>
          </div>

          <ActivityEngine onSuggest={handleSuggest} onTiredMode={handleTiredMode} />
          
          <div className="mt-auto p-6 bg-blue-50/50">
            <p className="text-xs text-center text-blue-400 font-medium">
              Offline-ready • Private • AI-Powered
            </p>
          </div>
        </>
      )}

      {view === 'activity' && suggestedActivity && (
        <ActivityCard 
          activity={suggestedActivity} 
          isFavorite={favorites.some(f => f.id === suggestedActivity.id)}
          pickingDate={pickingDate}
          onToggleFavorite={() => toggleFavorite(suggestedActivity)}
          onSchedule={handleScheduleActivity}
          onComplete={handleCompleteActivity}
          onSkip={handleSkip}
          onClose={() => setView('home')} 
        />
      )}

      {view === 'calendar' && (
        <CalendarView 
          scheduledActivities={scheduledActivities}
          onToggleComplete={toggleScheduleComplete}
          onAddActivity={(date) => {
            setPickingDate(date);
            setView('home');
          }}
          onClose={() => setView('home')}
        />
      )}
    </main>
  );
}