import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationStore {
  auraPoints: number;
  streakDays: number;
  lastLoginDate: string | null;
  addPoints: (points: number) => void;
  checkIn: () => void;
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      auraPoints: 500, // Starting bonus
      streakDays: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      addPoints: (points) => set((state) => ({ auraPoints: state.auraPoints + points })),
      checkIn: () => {
        const today = new Date().toISOString().split('T')[0];
        const last = get().lastLoginDate;
        if (last === today) return; // Already checked in today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        set((state) => {
          if (last === yesterdayStr) {
            // Keep streak alive
            return { streakDays: state.streakDays + 1, lastLoginDate: today, auraPoints: state.auraPoints + 50 };
          } else {
            // Break streak
            return { streakDays: 1, lastLoginDate: today, auraPoints: state.auraPoints + 10 };
          }
        });
      },
    }),
    {
      name: 'amoryst-gamification',
    }
  )
);
