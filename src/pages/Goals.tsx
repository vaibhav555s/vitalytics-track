import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, Calendar, FileText, Users, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const badges = [
  { id: 1, name: "First Reading", icon: Trophy, status: "earned", description: "Log your first hemoglobin reading", color: "text-warning" },
  { id: 2, name: "Week Streak", icon: Flame, status: "locked", description: "Log readings for 7 consecutive days", color: "text-destructive" },
  { id: 3, name: "Health Champion", icon: Star, status: "locked", description: "Maintain healthy levels for a month", color: "text-warning" },
  { id: 4, name: "Consistent Tracker", icon: Calendar, status: "earned", description: "Log readings for 30 days", color: "text-primary" },
  { id: 5, name: "Report Uploader", icon: FileText, status: "earned", description: "Upload your first lab report", color: "text-success" },
  { id: 6, name: "Doctor Connected", icon: Users, status: "locked", description: "Connect with your first doctor", color: "text-primary" },
];

const goalOptions = [
  "Log readings daily",
  "Log readings weekly",
  "Maintain healthy levels",
  "Track for 30 days",
  "Upload monthly reports",
];

export default function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const currentProgress = 4;
  const totalGoal = 7;
  const progressPercent = (currentProgress / totalGoal) * 100;

  const handleSetGoal = () => {
    if (selectedGoal) {
      toast.success(`Goal set: ${selectedGoal}`);
      setIsModalOpen(false);
      setSelectedGoal("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Weekly Goals Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Weekly Health Goals</h1>
                    <p className="text-muted-foreground">Track your progress and stay motivated</p>
                  </div>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="gradient">Set New Goal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set a New Goal</DialogTitle>
                        <DialogDescription>
                          Choose a health goal to track this week
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="goal">Select Goal</Label>
                          <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a goal" />
                            </SelectTrigger>
                            <SelectContent>
                              {goalOptions.map((goal) => (
                                <SelectItem key={goal} value={goal}>
                                  {goal}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="gradient" 
                          className="w-full"
                          onClick={handleSetGoal}
                        >
                          Set Goal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Log 7 readings this week</h3>
                      <p className="text-muted-foreground mb-4">
                        You've logged {currentProgress} out of {totalGoal} readings
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{currentProgress}/{totalGoal}</span>
                        </div>
                        <Progress value={progressPercent} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                          {progressPercent.toFixed(0)}% complete
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Badges Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
                <p className="text-muted-foreground mb-6">
                  Earn badges by achieving health milestones
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card 
                        className={`p-6 ${
                          badge.status === "locked" 
                            ? "opacity-50 grayscale" 
                            : "hover:shadow-xl transition-shadow"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`h-20 w-20 rounded-full ${
                            badge.status === "earned" 
                              ? "gradient-primary" 
                              : "bg-muted"
                          } flex items-center justify-center mx-auto mb-4`}>
                            {badge.status === "locked" ? (
                              <Lock className="h-10 w-10 text-muted-foreground" />
                            ) : (
                              <badge.icon className={`h-10 w-10 ${badge.color}`} />
                            )}
                          </div>
                          <h3 className="text-lg font-bold mb-2">{badge.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {badge.description}
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            badge.status === "earned"
                              ? "bg-success/10 text-success"
                              : "bg-muted/50 text-muted-foreground"
                          }`}>
                            {badge.status === "earned" ? "Earned" : "Locked"}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

// Missing import
import { Target } from "lucide-react";
