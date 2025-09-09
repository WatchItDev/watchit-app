export type Mood = 'happy' | 'sad' | 'tired' | 'mad' | 'relaxed' | 'excited';
export type TimeSlot = 'lt5' | 'm10' | 'm20' | 'm30' | 'h1' | 'gt1h';
export type Genre = 'comedy' | 'horror' | 'drama' | 'thriller' | 'action' | 'documentary' | 'romance' | 'animation' | 'sci-fi' | 'family';

export type TasteProfile = {
  moods: Partial<Record<Mood, number>>;
  genres: Partial<Record<Genre, number>>;
  durations: Partial<Record<TimeSlot, number>>;
  likedIds: Set<string>;
  dismissedIds: Set<string>;
};

export type WidgetSelection = {
  prompt?: string;
  mood?: Mood;
  time?: TimeSlot;
  genres: Genre[];
};
