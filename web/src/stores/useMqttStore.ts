import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MqttStore {
  objectCount: number;
  isConnected: boolean;
  isLogging: boolean;
  logs: string[];
  actions: {
    incrementObjectCount: () => void;
    setIsConnected: (connected: boolean) => void;
    setIsLogging: (logging: boolean) => void;
    addLog: (entry: string) => void;
    resetLog: () => void;
    resetCounter: () => void;
  };
}

const useMqttStore = create<MqttStore>()(
  persist(
    (set) => ({
      objectCount: 0,
      isConnected: false,
      isLogging: false,
      logs: [],
      actions: {
        incrementObjectCount: () =>
          set((state) => ({ objectCount: state.objectCount + 1 })),
        setIsConnected: (connected) => set({ isConnected: connected }),
        setIsLogging: (logging) => set({ isLogging: logging }),
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
      },
    }),
    {
      name: "mqtt-store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              key !== "isConnected" && key !== "actions" && key !== "isLogging"
          )
        ),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useMqttActions = () => useMqttStore((state) => state.actions);
export const useIsConnected = () => useMqttStore((state) => state.isConnected);
export const useIsLogging = () => useMqttStore((state) => state.isLogging);
export const useLogs = () => useMqttStore((state) => state.logs);
export const useObjectCounts = () => useMqttStore((state) => state.objectCount);
