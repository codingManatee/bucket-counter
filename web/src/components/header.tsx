"use client";
import { Clock, Thermometer, Wifi, WifiOff } from "lucide-react";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useIsConnected } from "@/stores/useMqttStore";

const Header = () => {
  const isConnected = useIsConnected();
  const temperature = 25;
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);
  return (
    <>
      <header className=" bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md">
        <div className="px-3 py-3 flex justify-between">
          <div className="flex items-center gap-2">
            <h1 className="hidden sm:block text-xl font-bold ">
              Bucket Logger
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:block text-white border-white "
            >
              v1.0
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={16} />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <Thermometer size={16} />
              <span className="font-medium">{temperature}°C</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span className="ml-1.5">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
