import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { TrendingUp, Activity, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockReadings = [
  { id: 1, date: "2025-01-15", time: "09:30 AM", value: 13.2, status: "normal", notes: "Feeling good today" },
  { id: 2, date: "2025-01-10", time: "02:15 PM", value: 12.8, status: "normal", notes: "After lunch checkup" },
  { id: 3, date: "2025-01-05", time: "08:00 AM", value: 11.5, status: "low", notes: "Feeling slightly tired" },
  { id: 4, date: "2024-12-28", time: "10:45 AM", value: 13.5, status: "normal", notes: "Regular checkup" },
  { id: 5, date: "2024-12-20", time: "03:30 PM", value: 14.1, status: "normal", notes: "Monthly test" },
];

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

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="gradient-primary p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
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
                    <p className="text-3xl font-bold text-success">13.2 g/dL</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-success" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Jan 15, 2025 at 9:30 AM</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Readings This Month</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3 from last month</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                    <p className="text-3xl font-bold">85/100</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-[hsl(var(--primary-start))] to-[hsl(var(--primary-end))] h-2 rounded-full" style={{ width: '85%' }}></div>
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

              <div className="space-y-3">
                {mockReadings.map((reading, index) => (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className={`p-4 border-l-4 ${getStatusColor(reading.status)} hover:shadow-lg transition-shadow cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold">{reading.date}</p>
                            <span className="text-sm text-muted-foreground">{reading.time}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reading.status)}`}>
                              {reading.status.charAt(0).toUpperCase() + reading.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-foreground mb-1">{reading.value} g/dL</p>
                          <p className="text-sm text-muted-foreground">{reading.notes}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
                    <p className="text-sm">
                      {[
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
                      ][Math.floor(Math.random() * 10)]}
                    </p>
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
