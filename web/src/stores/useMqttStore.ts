import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum shiftDisplay {
  day = "day",
  night = "night",
  today = "today",
}

interface MqttStore {
  objectCount: number;
  isConnected: boolean;
  logs: string[];
  timezone: number;
  selectedDay: Date;
  selectedShiftDisplay: shiftDisplay;
  actions: {
    incrementObjectCount: () => void;
    setIsConnected: (connected: boolean) => void;
    addLog: (entry: string) => void;
    resetLog: () => void;
    resetCounter: () => void;
    setTimeZone: (timezone: number) => void;
    setSelectedDay: (date: Date) => void;
    setSelectedShiftDisplay: (shift: shiftDisplay) => void;
  };
}

const useMqttStore = create<MqttStore>()(
  persist(
    (set) => ({
      objectCount: 0,
      isConnected: false,
      logs: [],
      timezone: 0,
      selectedDay: new Date(),
      selectedShiftDisplay: shiftDisplay.day,
      actions: {
        incrementObjectCount: () =>
          set((state) => ({ objectCount: state.objectCount + 1 })),
        setIsConnected: (connected) => set({ isConnected: connected }),
        addLog: (entry) => {
          const timestamp = new Date().toLocaleTimeString();
          set((state) => ({
            logs: [`[${timestamp}] ${entry}`, ...state.logs],
          }));
        },
        resetLog: () =>
          set({
            logs: [],
          }),
        resetCounter: () => {
          set({
            objectCount: 0,
          });
        },
        setTimeZone: (timezone) => set({ timezone: timezone }),
        setSelectedDay: (date) => set({ selectedDay: date }),
        setSelectedShiftDisplay: (shift) =>
          set({ selectedShiftDisplay: shift }),
      },
    }),
    {
      name: "mqtt-store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => key !== "isConnected" && key !== "actions"
          )
        ),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useMqttActions = () => useMqttStore((state) => state.actions);
export const useIsConnected = () => useMqttStore((state) => state.isConnected);
export const useLogs = () => useMqttStore((state) => state.logs);
export const useObjectCounts = () => useMqttStore((state) => state.objectCount);
export const useTimeZone = () => useMqttStore((state) => state.timezone);
export const useSelectedDay = () => useMqttStore((state) => state.selectedDay);
export const useSelectedShiftDisplay = () =>
  useMqttStore((state) => state.selectedShiftDisplay);
