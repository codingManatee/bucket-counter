import { ShiftDisplay } from "@/enums/mqttStore";
import { ConnectionStatus, LoggingStatus } from "@/types/mqttStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Locale = "en" | "ru";

interface MqttStore {
  connectionStatus: ConnectionStatus;
  loggingStatus: LoggingStatus;
  timezone: number;
  selectedDay: Date;
  selectedShiftDisplay: ShiftDisplay;
  locale: Locale;
  actions: {
    setConnectionStatus: (status: ConnectionStatus) => void;
    setLoggingStatus: (status: LoggingStatus) => void;
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
      loggingStatus: "hault",
      timezone: 0,
      selectedDay: new Date(),
      selectedShiftDisplay: ShiftDisplay.DAY,
      locale: (typeof navigator !== "undefined"
        ? navigator.language.startsWith("ru")
          ? "ru"
          : "en"
        : "en") as Locale,
      actions: {
        setConnectionStatus: (connectionStatus) =>
          set({ connectionStatus: connectionStatus }),
        setLoggingStatus: (loggingStatus: LoggingStatus) =>
          set({ loggingStatus: loggingStatus }),
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
export const useLoggingStatus = () =>
  useMqttStore((state) => state.loggingStatus);
export const useTimeZone = () => useMqttStore((state) => state.timezone);
export const useSelectedDay = () => useMqttStore((state) => state.selectedDay);
export const useSelectedShiftDisplay = () =>
  useMqttStore((state) => state.selectedShiftDisplay);
export { useMqttStore };
