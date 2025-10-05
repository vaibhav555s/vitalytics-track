import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, QrCode, Download } from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const mockReadings = [
  { id: 1, date: "2025-01-15", time: "09:30 AM", value: 13.2, status: "normal", notes: "Feeling good today", hasReport: true, mood: "😊" },
  { id: 2, date: "2025-01-10", time: "02:15 PM", value: 12.8, status: "normal", notes: "After lunch checkup", hasReport: false, mood: "🙂" },
  { id: 3, date: "2025-01-05", time: "08:00 AM", value: 11.5, status: "low", notes: "Feeling slightly tired", hasReport: true, mood: "😟" },
  { id: 4, date: "2024-12-28", time: "10:45 AM", value: 13.5, status: "normal", notes: "Regular checkup", hasReport: false, mood: "😊" },
  { id: 5, date: "2024-12-20", time: "03:30 PM", value: 14.1, status: "normal", notes: "Monthly test", hasReport: true, mood: "😊" },
  { id: 6, date: "2024-12-15", time: "11:00 AM", value: 13.0, status: "normal", notes: "Routine check", hasReport: false, mood: "🙂" },
  { id: 7, date: "2024-12-08", time: "09:15 AM", value: 12.5, status: "low", notes: "Early morning test", hasReport: true, mood: "😐" },
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

export default function Timeline() {
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [qrReading, setQrReading] = useState<typeof mockReadings[0] | null>(null);

  // Mark dates with readings
  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const hasReading = mockReadings.some(r => r.date === dateString);
    return hasReading ? "has-reading" : null;
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
            >
              <h1 className="text-3xl font-bold mb-2">Health Timeline</h1>
              <p className="text-muted-foreground mb-8">View your complete health history</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Calendar */}
                <Card className="p-6 lg:col-span-1">
                  <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
                  <div className="calendar-wrapper">
                    <Calendar
                      onChange={(value) => setDate(value as Date)}
                      value={date}
                      tileClassName={tileClassName}
                      className="border-0 w-full"
                    />
                  </div>
                  <style>{`
                    .calendar-wrapper .react-calendar {
                      border: none;
                      font-family: inherit;
                    }
                    .calendar-wrapper .react-calendar__tile--active {
                      background: hsl(var(--primary));
                      color: white;
                    }
                    .calendar-wrapper .react-calendar__tile--now {
                      background: hsl(var(--accent));
                    }
                    .calendar-wrapper .has-reading {
                      background: hsl(var(--success) / 0.2);
                      font-weight: 600;
                    }
                    .calendar-wrapper .react-calendar__tile:hover {
                      background: hsl(var(--accent));
                    }
                  `}</style>
                </Card>

                {/* Readings List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex gap-4">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Readings</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="value">By Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {mockReadings.map((reading, index) => (
                      <motion.div
                        key={reading.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className={`border-l-4 ${getStatusColor(reading.status)} hover:shadow-lg transition-all`}>
                          <button
                            onClick={() => setExpandedId(expandedId === reading.id ? null : reading.id)}
                            className="w-full p-4 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <p className="font-semibold">{reading.date}</p>
                                <span className="text-sm text-muted-foreground">{reading.time}</span>
                                {reading.mood && <span className="text-xl">{reading.mood}</span>}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reading.status)}`}>
                                  {reading.status.charAt(0).toUpperCase() + reading.status.slice(1)}
                                </span>
                              </div>
                              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedId === reading.id ? 'rotate-180' : ''}`} />
                            </div>
                            
                            <p className="text-2xl font-bold text-foreground">{reading.value} g/dL</p>
                            
                            {expandedId === reading.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t"
                              >
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Notes:</strong> {reading.notes}
                                </p>
                                {reading.hasReport && (
                                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-2">Report Available</p>
                                    <div className="h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                      [Report Thumbnail]
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQrReading(reading);
                                    }}
                                  >
                                    <QrCode className="h-4 w-4 mr-1" />
                                    Share via QR
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </button>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* QR Code Modal */}
      <Dialog open={!!qrReading} onOpenChange={() => setQrReading(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Reading via QR Code</DialogTitle>
          </DialogHeader>
          {qrReading && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCode 
                  value={JSON.stringify({
                    date: qrReading.date,
                    time: qrReading.time,
                    value: qrReading.value,
                    status: qrReading.status,
                    notes: qrReading.notes
                  })}
                  size={200}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Scan to view this report
              </p>
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => {
                  toast.success("QR code downloaded!");
                  setQrReading(null);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
