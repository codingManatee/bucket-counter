import { ShiftDisplay } from "@/enums/mqttStore";
import { ConnectionStatus, LoggingStatus } from "@/types/mqttStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Locale = "en" | "ru";

interface MqttStore {
  objectCount: number;
  connectionStatus: ConnectionStatus;
  logs: string[];
  loggingStatus: LoggingStatus;
  timezone: number;
  selectedDay: Date;
  selectedShiftDisplay: ShiftDisplay;
  locale: Locale;
  actions: {
    incrementObjectCount: () => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
    addLog: (entry: string) => void;
    setLoggingStatus: (status: LoggingStatus) => void;
    resetLog: () => void;
    resetCounter: () => void;
    setTimeZone: (timezone: number) => void;
    setSelectedShiftDisplay: (shift: ShiftDisplay) => void;
    setLocale: (locale: Locale) => void;
  };
}

const useMqttStore = create<MqttStore>()(
  persist(
    (set) => ({
      objectCount: 0,
      connectionStatus: "disconnected",
      logs: [],
      loggingStatus: "halted",
      timezone: 0,
      selectedDay: new Date(),
      selectedShiftDisplay: ShiftDisplay.DAY,
      locale: (typeof navigator !== "undefined"
        ? navigator.language.startsWith("ru")
          ? "ru"
          : "en"
        : "en") as Locale,
      actions: {
        incrementObjectCount: () =>
          set((state) => ({ objectCount: state.objectCount + 1 })),
        setConnectionStatus: (connectionStatus) =>
          set({ connectionStatus: connectionStatus }),
        setLoggingStatus: (loggingStatus: LoggingStatus) =>
          set({ loggingStatus: loggingStatus }),
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

        setSelectedShiftDisplay: (shift) =>
          set({ selectedShiftDisplay: shift }),
        setLocale: (locale: Locale) => set({ locale }),
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
export const useConnectionStatus = () =>
  useMqttStore((state) => state.connectionStatus);
export const useLogs = () => useMqttStore((state) => state.logs);
export const useLoggingStatus = () =>
  useMqttStore((state) => state.loggingStatus);
export const useObjectCounts = () => useMqttStore((state) => state.objectCount);
export const useTimeZone = () => useMqttStore((state) => state.timezone);
export const useSelectedDay = () => useMqttStore((state) => state.selectedDay);
export const useSelectedShiftDisplay = () =>
  useMqttStore((state) => state.selectedShiftDisplay);
export { useMqttStore };
