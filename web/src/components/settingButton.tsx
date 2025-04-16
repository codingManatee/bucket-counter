"use client";

import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsButton() {
  const [autoConnect, setAutoConnect] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logRetention, setLogRetention] = useState(7);
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    localStorage.setItem("timezone", timezone);
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    localStorage.setItem("autoConnect", autoConnect ? "true" : "false");
  }, [timezone, darkMode, autoConnect]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your Bucket Logger preferences
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-connect">Auto Connect</Label>
              <p className="text-sm text-muted-foreground">
                Automatically connect on startup
              </p>
            </div>
            <Switch
              id="auto-connect"
              checked={autoConnect}
              onCheckedChange={setAutoConnect}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-retention">Log Retention (days)</Label>
            <select
              id="log-retention"
              value={logRetention}
              onChange={(e) => setLogRetention(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Timestamps will be displayed in the selected timezone
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
