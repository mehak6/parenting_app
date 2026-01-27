'use client';

import React, { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import Onboarding from '../components/Onboarding';
import ActivityEngine from '../components/ActivityEngine';
import ActivityCard from '../components/ActivityCard';
import CalendarView from '../components/CalendarView';
import MaterialSelector from '../components/MaterialSelector';
import { ChildProfile, Mood, ParentEnergy, TimeAvailable, Activity, ScheduledActivity, AgeGroup } from '../types';
import { activities } from '../data/activities';
import { getActivityImage } from '../lib/activity-helpers';

import { generateActivity } from './actions';

const AGE_GROUPS = [
  { label: 'Tiny Steps', value: '12-24m', desc: '12-24m' },
  { label: 'Play Buddies', value: '2-3y', desc: '2-3y' },
  { label: 'Curious Cubs', value: '3-4y', desc: '3-4y' },
  { label: 'Little Thinkers', value: '4-5y', desc: '4-5y' },
  { label: 'Super Kids', value: '6+y', desc: '6+y' },
];

export default function Home() {
    const [profiles, setProfiles] = useState<ChildProfile[]>([]);
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [view, setView] = useState<'home' | 'activity' | 'calendar' | 'onboarding' | 'browse' | 'favorites' | 'settings'>('home');
    const [suggestedActivity, setSuggestedActivity] = useState<Activity | null>(null);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [favorites, setFavorites] = useState<Activity[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dailyPick, setDailyPick] = useState<Activity | null>(null);
    const [feedbackStats, setFeedbackStats] = useState<{positive: number, negative: number}>({ positive: 0, negative: 0 });
    
    // const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // Removed multi-select
    const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
    const [pickingDate, setPickingDate] = useState<string | null>(null);
    const [lastRequest, setLastRequest] = useState<
      | { type: 'material'; materialId: string }
      | { type: 'mood'; mood: Mood; energy: ParentEnergy; time: TimeAvailable }
      | { type: 'filter'; scenario: 'Travel' | 'Restaurant' | 'Rainy' | 'Meltdown' }
      | null
    >(null);

    // Handle Hardware Back Button
    useEffect(() => {
      const setupBackButton = async () => {
        const { remove } = await App.addListener('backButton', () => {
          if (view === 'activity') {
            setView('browse');
          } else if (view === 'browse') {
            setView('home');
          } else if (view !== 'home' && view !== 'onboarding') {
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
      const savedFeedback = localStorage.getItem('feedback_stats');
      if (savedFeedback) setFeedbackStats(JSON.parse(savedFeedback));
      
      // Set Daily Pick
      setDailyPick(activities[Math.floor(Math.random() * activities.length)]);
      
      setLoading(false);
    }, []);

    const handleFeedback = (type: 'positive' | 'negative') => {
        setFeedbackStats(prev => {
            const updated = { ...prev, [type]: prev[type] + 1 };
            localStorage.setItem('feedback_stats', JSON.stringify(updated));
            return updated;
        });
    };

    const activeProfile = profiles.find(p => p.id === activeProfileId) || null;
  
    const handleOnboardingComplete = (newProfile: ChildProfile) => {
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      setActiveProfileId(newProfile.id);
      localStorage.setItem('child_profiles', JSON.stringify(updatedProfiles));
      setView('home');
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

        const filtered = activities.filter(a => {
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
          setFilteredActivities(filtered);
          setView('browse');
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
            setFilteredActivities([aiActivity]);
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
      case '12-24m': return [12, 24];
      case '2-3y': return [24, 36];
      case '3-4y': return [36, 48];
      case '4-5y': return [48, 60];
      case '6+y': return [72, 144];
      // Legacy support
      case '18-24m': return [18, 24];
      case '4-6y': return [48, 72];
      case '6-10y': return [72, 120];
      default: return [0, 144];
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
      setFilteredActivities(filtered);
      setView('browse');
      return;
    }

    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({ ageGroup: activeProfile.ageGroup, mood, energy, time: '15min+', context });
        if (aiActivity) { 
          setSuggestedActivity(aiActivity); 
          setFilteredActivities([aiActivity]);
          setView('activity'); 
        }
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
      setFilteredActivities(filtered);
      setView('browse');
      return;
    }
    if (activeProfile) {
      setGenerating(true);
      try {
        const aiActivity = await generateActivity({ ageGroup: activeProfile.ageGroup, mood, energy, time });
        if (aiActivity) { 
          setSuggestedActivity(aiActivity); 
          setFilteredActivities([aiActivity]);
          setView('activity'); 
        }
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
      p.id === activeProfile.id ? { ...p, ageGroup: age as AgeGroup } : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('child_profiles', JSON.stringify(updatedProfiles));

    // Show ALL activities for this age group (Clear previous filters)
    setLastRequest(null);
    setSearchTerm('');
    
    const [minMonths, maxMonths] = getAgeRangeInMonths(age);
    const filtered = activities.filter(a => {
      return (a.minAge <= maxMonths && a.maxAge >= minMonths);
    });

    // Sort: Simpler activities first
    filtered.sort((a, b) => a.materials.length - b.materials.length);

    setFilteredActivities(filtered);
    setView('browse');
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
            <button onClick={() => setView('settings')} className="p-2 text-2xl text-gray-400 active:rotate-90 transition-transform">⚙️</button>
          </header>

          <div className="flex-1 space-y-2">

            {/* Hero Section */}
            {dailyPick && (
              <div className="px-6 pb-2 pt-2">
                <div onClick={() => { setSuggestedActivity(dailyPick); setView('activity'); }} className="relative h-48 rounded-3xl overflow-hidden shadow-lg shadow-blue-200 active:scale-95 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getActivityImage(dailyPick)} className="w-full h-full object-cover" alt="Daily Pick" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                    <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1 drop-shadow-md">✨ Activity of the Day</span>
                    <h2 className="text-white text-2xl font-black leading-tight drop-shadow-md">{dailyPick.name}</h2>
                  </div>
                </div>
              </div>
            )}
            
            {/* Age Group Selector */}
            <div className="px-6 py-2">
              <h2 className="text-lg font-bold text-gray-700 mb-3">Age Group</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {AGE_GROUPS.map((group) => (
                  <button
                    key={group.value}
                    onClick={() => handleAgeSelect(group.value)}
                    className={`shrink-0 w-28 px-2 py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                      activeProfile.ageGroup === group.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-tight text-center leading-tight">{group.label}</span>
                    <span className={`text-[10px] font-bold mt-1 ${activeProfile.ageGroup === group.value ? 'text-blue-100' : 'text-gray-400'}`}>
                      {group.desc}
                    </span>
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
          onClose={() => setView('browse')} 
          onFeedback={handleFeedback}
        />
      )}

      {view === 'browse' && (
        <div className="flex-1 flex flex-col bg-gray-50 min-h-screen relative pb-32">
           <header className="px-4 pt-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
             <button onClick={() => setView('home')} className="text-3xl text-gray-400">←</button>
             <h1 className="text-2xl font-bold text-blue-500 tracking-tight uppercase">ACTIVITIES</h1>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl text-blue-500">
               {activeProfile?.avatar || '👤'}
             </div>
           </header>

           <div className="bg-white px-6 pb-6 shadow-sm">
             <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
               <span className="text-gray-400 text-xl">🔍</span>
               <input 
                 type="text" 
                 placeholder="Search activities..." 
                 className="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="text-gray-400 text-xl">✕</button>
               )}
             </div>
           </div>

           <div className="p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 items-start">
             <div className="flex-1 flex flex-col gap-4">
               {filteredActivities
                 .filter(activity => 
                   activity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   activity.materials.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
                 )
                 .filter((_, i) => i % 2 === 0)
                 .map(activity => (
                   <div 
                     key={activity.id} 
                     onClick={() => { setSuggestedActivity(activity); setView('activity'); }} 
                     className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col active:scale-95 transition-all"
                   >
                     <div className="relative h-40 bg-gray-100">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         src={getActivityImage(activity)} 
                         alt={activity.name} 
                         className="w-full h-full object-cover" 
                       />
                       <button 
                         onClick={(e) => { e.stopPropagation(); toggleFavorite(activity); }}
                         className="absolute top-2 left-2 text-2xl drop-shadow-md active:scale-110 transition-transform"
                       >
                         {favorites.some(f => f.id === activity.id) ? '❤️' : '🤍'}
                       </button>
                     </div>
                     <div className="p-4 flex-1 flex items-start">
                       <h3 className="text-sm font-medium text-gray-700 line-clamp-2 leading-relaxed">{activity.name}</h3>
                     </div>
                   </div>
                 ))}
             </div>
             <div className="flex-1 flex flex-col gap-4 pt-8">
               {filteredActivities
                 .filter(activity => 
                   activity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   activity.materials.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
                 )
                 .filter((_, i) => i % 2 !== 0)
                 .map(activity => (
                   <div 
                     key={activity.id} 
                     onClick={() => { setSuggestedActivity(activity); setView('activity'); }} 
                     className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col active:scale-95 transition-all"
                   >
                     <div className="relative h-40 bg-gray-100">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         src={getActivityImage(activity)} 
                         alt={activity.name} 
                         className="w-full h-full object-cover" 
                       />
                       <button 
                         onClick={(e) => { e.stopPropagation(); toggleFavorite(activity); }}
                         className="absolute top-2 left-2 text-2xl drop-shadow-md active:scale-110 transition-transform"
                       >
                         {favorites.some(f => f.id === activity.id) ? '❤️' : '🤍'}
                       </button>
                     </div>
                     <div className="p-4 flex-1 flex items-start">
                       <h3 className="text-sm font-medium text-gray-700 line-clamp-2 leading-relaxed">{activity.name}</h3>
                     </div>
                   </div>
                 ))}
             </div>
           </div>
        </div>
      )}

      {view === 'favorites' && (
        <div className="flex-1 flex flex-col bg-gray-50 min-h-screen relative pb-32">
           <header className="px-4 pt-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
             <button onClick={() => setView('home')} className="text-3xl text-gray-400">←</button>
             <h1 className="text-2xl font-bold text-red-500 tracking-tight uppercase">FAVORITES</h1>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl text-blue-500">
               {activeProfile?.avatar || '👤'}
             </div>
           </header>

           {favorites.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
               <span className="text-6xl mb-4">💔</span>
               <p className="text-lg">No favorites yet!</p>
               <button onClick={() => setView('home')} className="mt-4 text-blue-500 font-bold">Explore Activities</button>
             </div>
           ) : (
             <div className="p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {favorites.map(activity => (
                 <div 
                   key={activity.id} 
                   onClick={() => { setSuggestedActivity(activity); setView('activity'); }} 
                   className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col active:scale-95 transition-all"
                 >
                   <div className="relative h-40 bg-gray-100">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={getActivityImage(activity)} 
                       alt={activity.name} 
                       className="w-full h-full object-cover" 
                     />
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleFavorite(activity); }}
                       className="absolute top-2 left-2 text-2xl drop-shadow-md active:scale-110 transition-transform"
                     >
                       ❤️
                     </button>
                   </div>
                   <div className="p-4 flex-1 flex items-start">
                     <h3 className="text-sm font-medium text-gray-700 line-clamp-2 leading-relaxed">{activity.name}</h3>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {view === 'settings' && activeProfile && (
        <div className="flex-1 flex flex-col bg-gray-50 min-h-screen relative pb-32">
           <header className="px-4 pt-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
             <button onClick={() => setView('home')} className="text-3xl text-gray-400">←</button>
             <h1 className="text-2xl font-bold text-gray-700 tracking-tight uppercase">SETTINGS</h1>
             <div className="w-10 h-10"></div>
           </header>

           <div className="p-6 space-y-8">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
               <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
                 {activeProfile.avatar || '👤'}
               </div>
               <h2 className="text-2xl font-black text-gray-800">{activeProfile.name}</h2>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">{activeProfile.ageGroup}</p>
             </div>

             <button 
               onClick={() => {
                 if(confirm('Are you sure? This will delete your profile.')) {
                    setProfiles([]);
                    localStorage.removeItem('child_profiles');
                    setView('onboarding');
                 }
               }}
               className="w-full bg-white border-2 border-red-100 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-between shadow-sm active:scale-95 transition-all"
             >
               <span>Reset Profile</span>
               <span>🗑️</span>
             </button>
             
             <div className="text-center text-gray-400 text-xs">
               v1.4.1 • Offline Mode
             </div>
           </div>
        </div>
      )}

      {view === 'calendar' && activeProfile && (
        <CalendarView scheduledActivities={scheduledActivities.filter(sa => sa.childId === activeProfile.id)} onToggleComplete={toggleScheduleComplete} onAddActivity={(date) => { setPickingDate(date); setView('home'); }} onClose={() => setView('home')} />
      )}

      {view !== 'activity' && (
          <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/90 backdrop-blur-xl flex items-center justify-around px-6 z-50 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50">
            <button onClick={() => setView('calendar')} className={`text-3xl transition-all ${view === 'calendar' ? 'scale-110 drop-shadow-md' : 'opacity-50 grayscale'}`}>📅</button>
            
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full -mt-12 border-4 border-white flex items-center justify-center shadow-xl shadow-blue-300 active:scale-90 transition-all cursor-pointer" onClick={() => handleSuggest('Creative', 'Medium')}>
              <span className="text-3xl">✨</span>
            </div>
            
            <button onClick={() => setView('favorites')} className={`text-3xl transition-all ${view === 'favorites' ? 'scale-110 drop-shadow-md' : 'opacity-50 grayscale'}`}>❤️</button>
          </nav>
      )}
    </main>
  );
}