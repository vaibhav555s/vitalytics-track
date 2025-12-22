import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronDown, QrCode, Download, Activity } from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useReadings, Reading } from "@/hooks/useReadings";

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

export default function Timeline() {
  const { data: readings, isLoading } = useReadings();
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [qrReading, setQrReading] = useState<Reading | null>(null);

  const filteredReadings = readings?.filter(reading => {
    if (filter === "all") return true;
    const readingDate = new Date(reading.reading_date);
    const now = new Date();
    if (filter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return readingDate >= weekAgo;
    }
    if (filter === "month") {
      return readingDate.getMonth() === new Date().getMonth();
    }
    return true;
  }) || [];

  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const hasReading = readings?.some(r => r.reading_date === dateString);
    return hasReading ? "has-reading" : null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold mb-2">Health Timeline</h1>
              <p className="text-muted-foreground mb-8">View your complete health history</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 lg:col-span-1">
                  <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
                  <div className="calendar-wrapper">
                    <Calendar onChange={(value) => setDate(value as Date)} value={date} tileClassName={tileClassName} className="border-0 w-full" />
                  </div>
                  <style>{`.calendar-wrapper .react-calendar { border: none; font-family: inherit; } .calendar-wrapper .react-calendar__tile--active { background: hsl(var(--primary)); color: white; } .calendar-wrapper .has-reading { background: hsl(var(--success) / 0.2); font-weight: 600; }`}</style>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                  <div className="flex gap-4">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Readings</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="p-4"><Skeleton className="h-20 w-full" /></Card>)}</div>
                  ) : filteredReadings.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No readings found</h3>
                      <p className="text-sm text-muted-foreground">Start tracking your hemoglobin levels</p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {filteredReadings.map((reading, index) => (
                        <motion.div key={reading.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                          <Card className={`border-l-4 ${getStatusColor(reading.status || 'normal')} hover:shadow-lg transition-all`}>
                            <button onClick={() => setExpandedId(expandedId === reading.id ? null : reading.id)} className="w-full p-4 text-left">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <p className="font-semibold">{new Date(reading.reading_date).toLocaleDateString()}</p>
                                  <span className="text-sm text-muted-foreground">{reading.reading_time.slice(0,5)}</span>
                                  {reading.mood && <span className="text-xl">{getMoodEmoji(reading.mood)}</span>}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reading.status || 'normal')}`}>
                                    {(reading.status || 'normal').charAt(0).toUpperCase() + (reading.status || 'normal').slice(1)}
                                  </span>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedId === reading.id ? 'rotate-180' : ''}`} />
                              </div>
                              <p className="text-2xl font-bold">{reading.value} {reading.unit}</p>
                              {expandedId === reading.id && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t">
                                  {reading.notes && <p className="text-sm text-muted-foreground mb-2"><strong>Notes:</strong> {reading.notes}</p>}
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setQrReading(reading); }}>
                                    <QrCode className="h-4 w-4 mr-1" /> Share via QR
                                  </Button>
                                </motion.div>
                              )}
                            </button>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <MobileNav />

      <Dialog open={!!qrReading} onOpenChange={() => setQrReading(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Share Reading via QR Code</DialogTitle></DialogHeader>
          {qrReading && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCode value={JSON.stringify({ date: qrReading.reading_date, value: qrReading.value, status: qrReading.status })} size={200} />
              </div>
              <p className="text-sm text-center text-muted-foreground">Scan to view this report</p>
              <Button variant="gradient" className="w-full" onClick={() => { toast.success("QR code downloaded!"); setQrReading(null); }}>
                <Download className="mr-2 h-4 w-4" /> Download QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
