import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAlertSettings, useUpdateAlertSettings } from "@/hooks/useAlertSettings";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: alertSettings, isLoading } = useAlertSettings();
  const updateSettings = useUpdateAlertSettings();
  
  const [smartAlerts, setSmartAlerts] = useState(true);
  const [healthReminders, setHealthReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [lowThreshold, setLowThreshold] = useState("12.0");
  const [criticalThreshold, setCriticalThreshold] = useState("10.0");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync local state with database values
  useEffect(() => {
    if (alertSettings) {
      setSmartAlerts(alertSettings.smart_alerts_enabled ?? true);
      setHealthReminders(alertSettings.health_reminders_enabled ?? true);
      setWeeklyReports(alertSettings.weekly_reports_enabled ?? false);
      setLowThreshold(String(alertSettings.low_threshold ?? 12.0));
      setCriticalThreshold(String(alertSettings.critical_threshold ?? 10.0));
    }
  }, [alertSettings]);

  const handleToggleChange = async (
    field: "smart_alerts_enabled" | "health_reminders_enabled" | "weekly_reports_enabled",
    value: boolean
  ) => {
    // Update local state immediately for responsiveness
    if (field === "smart_alerts_enabled") setSmartAlerts(value);
    if (field === "health_reminders_enabled") setHealthReminders(value);
    if (field === "weekly_reports_enabled") setWeeklyReports(value);

    try {
      await updateSettings.mutateAsync({ [field]: value });
    } catch (error) {
      // Revert on error
      if (field === "smart_alerts_enabled") setSmartAlerts(!value);
      if (field === "health_reminders_enabled") setHealthReminders(!value);
      if (field === "weekly_reports_enabled") setWeeklyReports(!value);
      toast.error("Failed to update setting");
    }
  };

  const handleSaveThresholds = async () => {
    const low = parseFloat(lowThreshold);
    const critical = parseFloat(criticalThreshold);

    if (isNaN(low) || isNaN(critical)) {
      toast.error("Please enter valid numbers");
      return;
    }

    if (critical >= low) {
      toast.error("Critical threshold must be lower than low threshold");
      return;
    }

    try {
      await updateSettings.mutateAsync({
        low_threshold: low,
        critical_threshold: critical,
      });
      toast.success("Alert thresholds updated successfully!");
    } catch (error) {
      toast.error("Failed to update thresholds");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your app preferences</p>
              </div>

              {/* Appearance */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Smart Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about important health changes
                        </p>
                      </div>
                      <Switch
                        checked={smartAlerts}
                        onCheckedChange={(value) => handleToggleChange("smart_alerts_enabled", value)}
                        disabled={updateSettings.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Health Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Reminders to log your readings
                        </p>
                      </div>
                      <Switch
                        checked={healthReminders}
                        onCheckedChange={(value) => handleToggleChange("health_reminders_enabled", value)}
                        disabled={updateSettings.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly health summaries
                        </p>
                      </div>
                      <Switch
                        checked={weeklyReports}
                        onCheckedChange={(value) => handleToggleChange("weekly_reports_enabled", value)}
                        disabled={updateSettings.isPending}
                      />
                    </div>
                  </div>
                )}

                {/* Alert Thresholds */}
                <div className="mt-6 pt-6 border-t space-y-4">
                  <h3 className="font-semibold mb-4">Alert Thresholds</h3>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lowThreshold">Low Hemoglobin Alert (g/dL)</Label>
                        <Input
                          id="lowThreshold"
                          type="number"
                          step="0.1"
                          value={lowThreshold}
                          onChange={(e) => setLowThreshold(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          You'll be notified when your Hb falls below this value
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="criticalThreshold">Critical Alert (g/dL)</Label>
                        <Input
                          id="criticalThreshold"
                          type="number"
                          step="0.1"
                          value={criticalThreshold}
                          onChange={(e) => setCriticalThreshold(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Critical alerts require immediate attention
                        </p>
                      </div>
                      <Button 
                        variant="gradient" 
                        className="w-full"
                        onClick={handleSaveThresholds}
                        disabled={updateSettings.isPending}
                      >
                        {updateSettings.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Thresholds"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Account Security */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Security</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Choose a new password for your account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        variant="gradient" 
                        className="w-full"
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
