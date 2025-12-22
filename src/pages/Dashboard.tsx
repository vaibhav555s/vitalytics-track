import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Activity, Award, ChevronRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useReadings, useLatestReading, useMonthlyReadingsCount } from "@/hooks/useReadings";
import { useAlertSettings } from "@/hooks/useAlertSettings";
import { useMemo } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal": return "border-success";
    case "low": return "border-warning";
    case "critical": return "border-destructive";
    default: return "border-muted";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "normal": return "bg-success/10 text-success";
    case "low": return "bg-warning/10 text-warning";
    case "critical": return "bg-destructive/10 text-destructive";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

const getMoodEmoji = (mood: string | null) => {
  switch (mood) {
    case "great": return "😊";
    case "good": return "🙂";
    case "okay": return "😐";
    case "tired": return "😟";
    case "unwell": return "😢";
    default: return null;
  }
};

const healthTips = [
  "Eat iron-rich foods like spinach, lentils, and red meat to boost hemoglobin.",
  "Vitamin C helps iron absorption. Pair iron-rich foods with citrus fruits.",
  "Stay hydrated! Drink at least 8 glasses of water daily.",
  "Regular exercise improves blood circulation and oxygen levels.",
  "Get enough sleep - 7-8 hours per night helps maintain healthy blood levels.",
  "Include folate-rich foods like beans and leafy greens in your diet.",
  "Avoid tea or coffee with meals as they can inhibit iron absorption.",
  "Consider iron supplements if recommended by your doctor.",
  "Cook in cast iron pots to naturally increase iron in your food.",
  "Regular health checkups help monitor your hemoglobin levels effectively."
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: readings, isLoading: readingsLoading } = useReadings();
  const { data: latestReading, isLoading: latestLoading } = useLatestReading();
  const { data: monthlyCount, isLoading: monthlyLoading } = useMonthlyReadingsCount();
  const { data: alertSettings } = useAlertSettings();

  const recentReadings = readings?.slice(0, 5) || [];
  const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  // Calculate health score based on readings
  const healthScore = useMemo(() => {
    if (!readings || readings.length === 0) return 0;
    const normalCount = readings.filter(r => r.status === 'normal').length;
    return Math.round((normalCount / readings.length) * 100);
  }, [readings]);

  // Check for alerts
  const showAlert = useMemo(() => {
    if (!latestReading || !alertSettings) return null;
    if (latestReading.value < alertSettings.critical_threshold) {
      return { type: 'critical', message: '⚠️ Your hemoglobin level is critically low. Please consult a doctor immediately.' };
    }
    if (latestReading.value < alertSettings.low_threshold) {
      return { type: 'low', message: '⚠️ Your hemoglobin level is below normal. Consider consulting a doctor.' };
    }
    return null;
  }, [latestReading, alertSettings]);

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Alert Banner */}
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`p-4 ${showAlert.type === 'critical' ? 'bg-destructive/10 border-destructive' : 'bg-warning/10 border-warning'}`}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${showAlert.type === 'critical' ? 'text-destructive' : 'text-warning'}`} />
                    <p className={`font-medium ${showAlert.type === 'critical' ? 'text-destructive' : 'text-warning'}`}>
                      {showAlert.message}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="gradient-primary p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
                <p className="text-white/90 mb-1">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-white/80 text-sm">Keep up the great work tracking your health!</p>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Latest Hemoglobin</p>
                    {latestLoading ? (
                      <Skeleton className="h-9 w-24" />
                    ) : latestReading ? (
                      <p className={`text-3xl font-bold ${
                        latestReading.status === 'normal' ? 'text-success' :
                        latestReading.status === 'low' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {latestReading.value} {latestReading.unit}
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-muted-foreground">--</p>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-success" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestReading 
                    ? `${new Date(latestReading.reading_date).toLocaleDateString()} at ${latestReading.reading_time.slice(0, 5)}`
                    : 'No readings yet'
                  }
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Readings This Month</p>
                    {monthlyLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      <p className="text-3xl font-bold">{monthlyCount?.current || 0}</p>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {monthlyCount && monthlyCount.current > monthlyCount.previous && (
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{monthlyCount.current - monthlyCount.previous} from last month</span>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                    <p className="text-3xl font-bold">{healthScore}/100</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[hsl(var(--primary-start))] to-[hsl(var(--primary-end))] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${healthScore}%` }}
                  ></div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Readings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Readings</h2>
                <Link to="/timeline" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {readingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-20 w-full" />
                    </Card>
                  ))}
                </div>
              ) : recentReadings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No readings yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start tracking your hemoglobin levels</p>
                  <Link to="/add-reading">
                    <motion.button 
                      className="gradient-primary text-white px-6 py-2 rounded-full font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Add First Reading
                    </motion.button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentReadings.map((reading, index) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className={`p-4 border-l-4 ${getStatusColor(reading.status || 'normal')} hover:shadow-lg transition-shadow cursor-pointer`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">{new Date(reading.reading_date).toLocaleDateString()}</p>
                              <span className="text-sm text-muted-foreground">{reading.reading_time.slice(0, 5)}</span>
                              {reading.mood && <span className="text-xl">{getMoodEmoji(reading.mood)}</span>}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reading.status || 'normal')}`}>
                                {(reading.status || 'normal').charAt(0).toUpperCase() + (reading.status || 'normal').slice(1)}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-foreground mb-1">{reading.value} {reading.unit}</p>
                            {reading.notes && <p className="text-sm text-muted-foreground">{reading.notes}</p>}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Nutritional Tips Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Today's Health Tip</h3>
                    <p className="text-sm">{randomTip}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />
      <FloatingActionButton />
    </div>
  );
}
