'use client';

import React, { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import Onboarding from '../components/Onboarding';
import ActivityEngine from '../components/ActivityEngine';
import ActivityCard from '../components/ActivityCard';
import CalendarView from '../components/CalendarView';
import MaterialSelector from '../components/MaterialSelector';
import { ChildProfile, Mood, ParentEnergy, TimeAvailable, Activity, ScheduledActivity } from '../types';
import { activities } from '../data/activities';

import { generateActivity, remixActivity } from './actions';

const AGE_GROUPS = [
  { label: 'Toddler', value: '18-24m' },
  { label: 'Preschool', value: '2-3y' },
  { label: 'Early Years', value: '3-4y' },
  { label: 'Kindy', value: '4-6y' },
  { label: 'Big Kid', value: '6-10y' },
];

export default function Home() {
    const [profiles, setProfiles] = useState<ChildProfile[]>([]);
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [view, setView] = useState<'home' | 'activity' | 'calendar' | 'onboarding'>('home');
    const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null);
    const [favorites, setFavorites] = useState<Activity[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    
    // const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // Removed multi-select
    const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
    const [pickingDate, setPickingDate] = useState<string | null>(null);
    const [lastRequest, setLastRequest] = useState<
      | { type: 'material'; materialId: string }
      | { type: 'mood'; mood: Mood; energy: ParentEnergy; time: TimeAvailable }
      | { type: 'filter'; scenario: 'Travel' | 'Restaurant' | 'Rainy' | 'Meltdown' }
      | null
    >(null);
    const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

    // Handle Hardware Back Button
    useEffect(() => {
      const setupBackButton = async () => {
        const { remove } = await App.addListener('backButton', () => {
          if (view !== 'home' && view !== 'onboarding') {
            setView('home');
          } else {
            App.exitApp();
          }
        });
        return remove;
      };
      
      const removePromise = setupBackButton();
      return () => { removePromise.then(remove => remove()); };
    }, [view]);

    // Splash Screen Timer
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }, []);
      
    useEffect(() => {
      const savedProfiles = localStorage.getItem('child_profiles');
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        setProfiles(parsed);
        if (parsed.length > 0) setActiveProfileId(parsed[0].id);
        else setView('onboarding');
      } else {
        const oldProfile = localStorage.getItem('child_profile');
        if (oldProfile) {
          const parsed = JSON.parse(oldProfile);
          setProfiles([parsed]);
          setActiveProfileId(parsed.id);
          localStorage.setItem('child_profiles', JSON.stringify([parsed]));
        } else setView('onboarding');
      }

      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      const savedSchedule = localStorage.getItem('scheduled_activities');
      if (savedSchedule) setScheduledActivities(JSON.parse(savedSchedule));
      const savedHistory = localStorage.getItem('activity_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
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

    const MATERIAL_MAPPINGS: Record<string, string[]> = {
      'Balloon': ['balloon'],
      'Dice': ['dice', 'die'],
      'Box': ['box', 'cardboard'],
      'Paper': ['paper', 'newspaper', 'magazine', 'book'],
      'Tape': ['tape'],
      'Cups': ['cup'],
      'Socks': ['sock'],
      'Pillows': ['pillow', 'cushion'],
      'Crayons': ['crayon', 'marker', 'pencil', 'pen'],
      'Toys': ['toy', 'lego', 'block', 'doll'],
      'Stick': ['stick', 'twig'],
      'Music': ['music', 'song'],
      'Cards': ['card', 'deck']
    };

    const handleMaterialSelect = async (materialId: string) => {
        if (!activeProfile) return;
        setLastRequest({ type: 'material', materialId });
    
        const [minMonths, maxMonths] = getAgeRangeInMonths(activeProfile.ageGroup);
        
        // Strict Keyword Matching
        const targetKeywords = MATERIAL_MAPPINGS[materialId] || [materialId.toLowerCase()];

        let filtered = activities.filter(a => {
          // 1. Age Check
          if (!(a.minAge <= maxMonths && a.maxAge >= minMonths)) return false;

          // 2. Material Check (Strict)
          // Check if ANY of the activity's materials contain ANY of the target keywords
          return a.materials.some(actMat => {
            const matLower = actMat.toLowerCase();
            
            // Special Exception: Don't match "Cardboard" when looking for "Cards"
            if (materialId === 'Cards' && matLower.includes('cardboard')) return false;

            return targetKeywords.some(keyword => matLower.includes(keyword));
          });
        });

        // Sort by "Material Purity" (fewer materials = better match)
        filtered.sort((a, b) => a.materials.length - b.materials.length);
    
        if (filtered.length > 0) {
          const unseen = filtered.filter(a => !history.includes(a.id));
          if (unseen.length > 0) {
            setSuggestedActivity(unseen[0]); // Pick top match
            updateHistory(unseen[0].id);
            setView('activity');
            return;
          }
          setSuggestedActivity(filtered[Math.floor(Math.random() * filtered.length)]);
          setView('activity');
          return;
        }
    
        // 2. Use AI if no local match
        setGenerating(true);
        try {
          // Use the Label or ID for context, e.g., "using Cards"
          const aiActivity = await generateActivity({
            ageGroup: activeProfile.ageGroup,
            mood: 'Creative',
            energy: 'Medium',
            time: '15min+',
            context: `using ${materialId}`
          });
          if (aiActivity) {
            setSuggestedActivity(aiActivity);
            setView('activity');
          }
        } catch (e) { console.error(e); } finally { setGenerating(false); }
      };

  const toggleFavorite = (activity: Activity) => {
    const isFav = favorites.some(f => f.id === activity.id);
    let newFavs;
    if (isFav) newFavs = favorites.filter(f => f.id !== activity.id);
    else newFavs = [...favorites, activity];
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
      completed: true,
      childId: activeProfileId
    };
    const updated = [...scheduledActivities, newSchedule];
    setScheduledActivities(updated);
    localStorage.setItem('scheduled_activities', JSON.stringify(updated));
  };

  const toggleScheduleComplete = (id: string) => {
    const updated = scheduledActivities.map(sa => sa.id === id ? { ...sa, completed: !sa.completed } : sa);
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
    setLastRequest({ type: 'filter', scenario });

    let mood: Mood = 'Calm';
    let energy: ParentEnergy = 'Low';
    let context = '';
    switch (scenario) {
      case 'Travel': mood = 'Calm'; energy = 'Low'; context = 'in a car or plane (seated, no loose items)'; break;
      case 'Restaurant': mood = 'Calm'; energy = 'Medium'; context = 'at a restaurant table (quiet, contained)'; break;
      case 'Rainy': mood = 'Creative'; energy = 'Medium'; context = 'indoors on a rainy day'; break;
      case 'Meltdown': mood = 'Calm'; energy = 'Low'; context = 'to calm down a tantrum or meltdown'; break;
    }
    const [minMonths, maxMonths] = getAgeRangeInMonths(activeProfile.ageGroup);
    const filtered = activities.filter(a => {
      const ageMatch = a.minAge <= maxMonths && a.maxAge >= minMonths;
      if (!ageMatch) return false;
      const hasContext = (ctx: string) => a.context?.includes(ctx);
      if (scenario === 'Travel') return hasContext('Car') || hasContext('Plane') || hasContext('Waiting Room');
      if (scenario === 'Restaurant') return hasContext('Restaurant') || hasContext('Waiting Room');
      if (scenario === 'Rainy') return hasContext('Home') && (a.moods.includes('Creative') || a.moods.includes('Learning'));
      if (scenario === 'Meltdown') return (hasContext('Home') || hasContext('Car')) && a.moods.includes('Calm') && a.isLowEnergy;
      return false;
    });
    
    if (filtered.length > 0) {
      const unseen = filtered.filter(a => !history.includes(a.id));
      if (unseen.length > 0) {
        setSuggestedActivity(unseen[Math.floor(Math.random() * unseen.length)]);
        setView('activity');
        return;
      }
      setSuggestedActivity(filtered[Math.floor(Math.random() * filtered.length)]);
      setView('activity');
      return;
    }

    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({ ageGroup: activeProfile.ageGroup, mood, energy, time: '15min+', context });
        if (aiActivity) { setSuggestedActivity(aiActivity); setView('activity'); }
      } catch (e) { console.error(e); } finally { setGenerating(false); }
    }
  };

  const handleSuggest = async (mood: Mood, energy: ParentEnergy, time: TimeAvailable = '15min+') => {
    if (!activeProfile) return;
    setLastRequest({ type: 'mood', mood, energy, time }); 
    const [minMonths, maxMonths] = getAgeRangeInMonths(activeProfile.ageGroup);
    const filtered = activities.filter(a => {
      if (!(a.minAge <= maxMonths && a.maxAge >= minMonths)) return false;
      const moodMatch = a.moods.includes(mood);
      const energyMatch = energy === 'High' ? true : energy === 'Medium' ? a.parentEnergy !== 'High' : a.parentEnergy === 'Low';
      return moodMatch && energyMatch;
    });
    if (filtered.length > 0) {
      const unseen = filtered.filter(a => !history.includes(a.id));
      if (unseen.length > 0) {
        const selection = unseen[Math.floor(Math.random() * unseen.length)];
        setSuggestedActivity(selection);
        updateHistory(selection.id);
        setView('activity');
        return;
      }
      // If all seen, pick random from filtered
      setSuggestedActivity(filtered[Math.floor(Math.random() * filtered.length)]);
      setView('activity');
      return;
    }
    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({ ageGroup: activeProfile.ageGroup, mood, energy, time });
        if (aiActivity) { setSuggestedActivity(aiActivity); setView('activity'); }
      } catch (e) { console.error(e); } finally { setGenerating(false); }
    }
  };

  const handleSkip = () => {
    if (lastRequest) {
      if (lastRequest.type === 'material') {
        handleMaterialSelect(lastRequest.materialId);
      } else if (lastRequest.type === 'mood') {
        handleSuggest(lastRequest.mood, lastRequest.energy, lastRequest.time);
      } else if (lastRequest.type === 'filter') {
        handleQuickFilter(lastRequest.scenario);
      }
    } else {
      setSuggestedActivity(activities[Math.floor(Math.random() * activities.length)]);
    }
  };

  const handleAgeSelect = (age: string) => {
    if (!activeProfile) return;
    const updatedProfiles = profiles.map(p => 
      p.id === activeProfile.id ? { ...p, ageGroup: age as any } : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('child_profiles', JSON.stringify(updatedProfiles));
  };

  const handleRemix = async (type: 'Easier' | 'Harder' | 'NoMaterials') => {
    if (!suggestedActivity) return;
    setGenerating(true);
    try {
      const remixed = await remixActivity(suggestedActivity, type);
      if (remixed) setSuggestedActivity(remixed);
      else alert("Couldn't remix this activity. Try again!");
    } catch (e) { console.error(e); } finally { setGenerating(false); }
  };

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter animate-in slide-in-from-left duration-1000 ease-out">
          Parenting Companion
        </h1>
        <p className="mt-4 text-gray-400 animate-in fade-in duration-1000 delay-500">Making every day play day</p>
      </div>
    );
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} onCancel={profiles.length > 0 ? () => setView('home') : undefined} />;
  if (!activeProfile) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <main className="flex-1 flex flex-col bg-gray-50 min-h-screen relative pb-32">
      {generating && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium animate-pulse">Dreaming up a new idea...</p>
        </div>
      )}

      {view === 'home' && (
        <>
          <header className="px-6 pt-12 pb-2 flex justify-between items-center bg-white sticky top-0 z-50">
            <h1 className="text-3xl font-black text-blue-500 tracking-tight">EXPLORE</h1>
          </header>

          <div className="flex-1 space-y-2">
            
            {/* Age Group Selector */}
            <div className="px-6 py-2">
              <h2 className="text-lg font-bold text-gray-700 mb-3">Age Group</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {AGE_GROUPS.map((group) => (
                  <button
                    key={group.value}
                    onClick={() => handleAgeSelect(group.value)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                      activeProfile.ageGroup === group.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="px-6 py-4">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Location</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { id: 'Rainy', label: 'Indoors', icon: '🏠', color: 'bg-blue-400' },
                  { id: 'Travel', label: 'In the Car', icon: '🚗', color: 'bg-green-400' },
                  { id: 'Restaurant', label: 'Restaurant', icon: '🍽️', color: 'bg-orange-400' },
                  { id: 'Meltdown', label: 'Calm Down', icon: '🧘', color: 'bg-purple-400' }
                ].map((loc) => (
                  <button key={loc.id} onClick={() => handleQuickFilter(loc.id as 'Travel' | 'Restaurant' | 'Rainy' | 'Meltdown')} className="flex-shrink-0 w-40 h-28 rounded-2xl overflow-hidden relative flex flex-col shadow-sm group active:scale-95 transition-all">
                    <div className={`flex-1 flex items-center justify-center text-4xl ${loc.color}`}>{loc.icon}</div>
                    <div className="bg-white p-2 text-center"><span className="text-xs font-bold text-gray-700">{loc.label}</span></div>
                  </button>
                ))}
              </div>
            </div>

            <MaterialSelector onSelectMaterial={handleMaterialSelect} />

            {/* Mood/Skill Section */}
            <div className="pb-10">
              <ActivityEngine onSuggest={handleSuggest} onTiredMode={() => handleQuickFilter('Meltdown')} />
            </div>
          </div>

          {/* Bottom Nav Bar */}
          <nav className="fixed bottom-4 left-4 right-4 h-20 bg-blue-500 flex items-center justify-around px-6 z-50 rounded-[40px] shadow-2xl">
            <button onClick={() => setView('home')} className="text-white text-2xl">🏠</button>
            <button onClick={() => setView('calendar')} className="text-white text-2xl">📅</button>
            <div className="w-16 h-16 bg-white rounded-full -mt-16 border-8 border-gray-50 flex items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer" onClick={() => handleSuggest('Creative', 'Medium')}>
              <span className="text-3xl">✨</span>
            </div>
            <button onClick={() => setFavorites(favorites)} className="text-white text-2xl">❤️</button>
            <button onClick={() => setView('onboarding')} className="text-white text-2xl">👤</button>
          </nav>
        </>
      )}

      {view === 'activity' && suggestedActivity && (
        <ActivityCard activity={suggestedActivity} isFavorite={favorites.some(f => f.id === suggestedActivity.id)} pickingDate={pickingDate} onToggleFavorite={() => toggleFavorite(suggestedActivity)} onSchedule={handleScheduleActivity} onComplete={handleCompleteActivity} onSkip={handleSkip} onRemix={handleRemix} onClose={() => setView('home')} />
      )}

      {view === 'calendar' && activeProfile && (
        <CalendarView scheduledActivities={scheduledActivities.filter(sa => sa.childId === activeProfile.id)} onToggleComplete={toggleScheduleComplete} onAddActivity={(date) => { setPickingDate(date); setView('home'); }} onClose={() => setView('home')} />
      )}
    </main>
  );
}