"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/user/dashboard-shell";
import { DashboardHeader } from "@/components/user/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data - replace with actual API call
const mockSettings = {
  siteName: "QuizMaster",
  siteDescription: "The ultimate quiz platform",
  maintenanceMode: false,
  defaultQuizTimeLimit: 60,
  allowGuestAttempts: true,
  theme: "light",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);

  const handleSaveSettings = () => {
    // In a real application, you would make an API call here
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your application settings here."
      />
      <div className="space-y-6 mt-10 mx-auto max-w-3xl">
        <div>
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure general settings for your application.
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium">Quiz Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure default settings for quizzes.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="defaultQuizTimeLimit">
              Default Quiz Time Limit (seconds)
            </Label>
            <Input
              id="defaultQuizTimeLimit"
              type="number"
              value={settings.defaultQuizTimeLimit}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultQuizTimeLimit: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allowGuestAttempts"
              checked={settings.allowGuestAttempts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowGuestAttempts: checked })
              }
            />
            <Label htmlFor="allowGuestAttempts">Allow Guest Attempts</Label>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your application.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                setSettings({ ...settings, theme: value })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </DashboardShell>
  );
}
