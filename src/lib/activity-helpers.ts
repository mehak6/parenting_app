import { Activity } from '../types';

export const getActivityImage = (act: Activity) => {
  const mat = act.materials[0]?.toLowerCase() || '';
  const name = act.name.toLowerCase();
  
  if (mat.includes('balloon')) return 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('crayon') || mat.includes('paper') || mat.includes('marker')) return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('tape') || name.includes('tape')) return 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&w=800&q=80'; 
  if (mat.includes('box') || mat.includes('cardboard')) return 'https://images.unsplash.com/photo-1587654780291-39c940483731?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('cup')) return 'https://images.unsplash.com/photo-1610847035973-c6eb495e2e8e?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('sock')) return 'https://images.unsplash.com/photo-1517677208171-0bc5e2e3b6bd?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('pillow') || name.includes('fort')) return 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('cards') || name.includes('card')) return 'https://images.unsplash.com/photo-1605218427306-6354d4315320?auto=format&fit=crop&w=800&q=80';
  if (mat.includes('dice')) return 'https://images.unsplash.com/photo-1595757816291-ab4c1cba0f07?auto=format&fit=crop&w=800&q=80';
  if (act.moods.includes('Active')) return 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80';
  
  return 'https://images.unsplash.com/photo-1502086223501-686db63fbff4?auto=format&fit=crop&w=800&q=80'; 
};