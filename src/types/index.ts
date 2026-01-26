export type AgeGroup = '12-24m' | '2-3y' | '3-4y' | '4-5y' | '6+y';

export type Mood = 'Active' | 'Calm' | 'Restless' | 'Learning' | 'Creative' | 'Social' | 'Focus' | 'Funny' | 'Meaningful' | 'Musical' | 'Competitive';

export type ParentEnergy = 'Low' | 'Medium' | 'High';

export type TimeAvailable = '5min' | '10min' | '15min+';

export interface ChildProfile {
  id: string;
  name?: string;
  dob: string; // ISO date
  ageGroup: AgeGroup;
  gender?: string;
  language: 'English' | 'Hindi' | 'Hinglish';
  avatar?: string;
}

export interface Activity {
  id: string;
  name: string;
  minAge: number; // in months
  maxAge: number; // in months
  moods: Mood[];
  parentEnergy: ParentEnergy;
  timeRequired: TimeAvailable;
  materials: string[];
  instructions: string[];
  skillFocus: string[];
  isLowEnergy: boolean;
  proTip?: string;
  context?: string[]; // 'Home', 'Car', 'Restaurant', 'Outdoor', 'Plane'
}

export interface ScheduledActivity {
  id: string;
  activityId: string;
  activityName: string; // Snapshot for display
  activityMoods: Mood[]; // Snapshot for display
  date: string; // YYYY-MM-DD
  time?: string;
  completed: boolean;
  childId?: string;
}
