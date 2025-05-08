"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { useMqttActions, useTimeZone } from "@/stores/useMqttStore";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function SettingsButton() {
  const { setTimeZone, setLocale } = useMqttActions();
  const timezone = useTimeZone();
  const t = useTranslations("Setting");
  const router = useRouter();
  const path = usePathname();
  const current = path.split("/")[1] || "en";

  const changeLocale = (next: "en" | "ru") => {
    const withoutLocale = path.replace(/^\/(en|ru)/, "");
    router.push(`/${next}${withoutLocale}`);
    setLocale(next);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="timezone">{t("timezone")}</Label>
            <select
              id="timezone"
              value={timezone ?? ""}
              onChange={(e) => setTimeZone(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value={-12}>GMT-12:00</option>
              <option value={-11}>GMT-11:00</option>
              <option value={-10}>GMT-10:00</option>
              <option value={-9}>GMT-09:00</option>
              <option value={-8}>GMT-08:00</option>
              <option value={-7}>GMT-07:00</option>
              <option value={-6}>GMT-06:00</option>
              <option value={-5}>GMT-05:00</option>
              <option value={-4}>GMT-04:00</option>
              <option value={-3}>GMT-03:00</option>
              <option value={-2}>GMT-02:00</option>
              <option value={-1}>GMT-01:00</option>
              <option value={0}>GMT+00:00 (UTC)</option>
              <option value={1}>GMT+01:00</option>
              <option value={2}>GMT+02:00</option>
              <option value={3}>GMT+03:00</option>
              <option value={4}>GMT+04:00</option>
              <option value={5}>GMT+05:00</option>
              <option value={5.5}>GMT+05:30</option>
              <option value={6}>GMT+06:00</option>
              <option value={7}>GMT+07:00</option>
              <option value={8}>GMT+08:00</option>
              <option value={9}>GMT+09:00</option>
              <option value={10}>GMT+10:00</option>
              <option value={11}>GMT+11:00</option>
              <option value={12}>GMT+12:00</option>
            </select>

            <p className="text-xs text-muted-foreground mt-1">
              {t("timezone_helper")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locale">{t("language")}</Label>
            <select
              id="locale"
              value={current}
              onChange={(e) => changeLocale(e.target.value as "en" | "ru")}
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {t("language_helper")}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// TODO:
{
  /* <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-connect">Auto Connect</Label>
              <p className="text-sm text-muted-foreground">
                Automatically connect on startup
              </p>
            </div>
            <Switch
              id="auto-connect"
              checked={autoConnect ?? false}
              onCheckedChange={setAutoConnect}
            />
          </div> */
}

{
  /* <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode === "dark"}
              onCheckedChange={(checked) => {
                checked ? setDarkMode("dark") : setDarkMode("light");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-retention">Log Retention (days)</Label>
            <select
              id="log-retention"
              value={logRetention ?? ""}
              // onChange={(e) => setLogRetention(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div> */
}
