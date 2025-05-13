"use client";

import { Clock, Loader, Thermometer, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import SettingsButton from "./settingButton";
import { Badge } from "../ui/badge";
import { useConnectionStatus } from "@/stores/useMqttStore";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Header");
  const connectionStatus = useConnectionStatus();
  const temperature = 25;
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const statusIcon = {
    connected: <Wifi size={16} />,
    reconnecting: <Loader size={16} />,
    disconnected: <WifiOff size={16} />,
  } as const;

  const statusKey =
    `status${connectionStatus[0].toUpperCase()}${connectionStatus.slice(1)}` as
      | "statusConnected"
      | "statusReconnecting"
      | "statusDisconnected";

  return (
    <header className="bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md">
      <div className="px-3 py-3 flex justify-between">
        <div className="flex items-center gap-2 select-none">
          <a href="/">
            <h1 className="hidden sm:block text-xl font-bold">
              {t("appName")}
            </h1>
          </a>
          <Badge
            variant="outline"
            className="hidden sm:block text-white border-white"
          >
            v2.0
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Clock */}
          <div className="flex items-center gap-1.5 text-sm">
            <Clock size={16} />
            <span>{currentTime}</span>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
            <Thermometer size={16} />
            <span className="font-medium">
              {temperature}
              {t("temperatureUnit")}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
            {statusIcon[connectionStatus]}
            <span className="ml-1.5">{t(statusKey)}</span>
          </div>

          {/* Settings Button */}
          <div>
            <SettingsButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
