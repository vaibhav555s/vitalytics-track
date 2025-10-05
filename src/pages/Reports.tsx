import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockReports = [
  { id: 1, date: "2025-01-15", hbValue: 13.2, thumbnail: "/placeholder.svg" },
  { id: 2, date: "2025-01-10", hbValue: 12.8, thumbnail: "/placeholder.svg" },
  { id: 3, date: "2025-01-05", hbValue: 11.5, thumbnail: "/placeholder.svg" },
  { id: 4, date: "2024-12-28", hbValue: 13.5, thumbnail: "/placeholder.svg" },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

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
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">My Reports</h1>
                <p className="text-muted-foreground">View and manage your uploaded lab reports</p>
              </div>

              {mockReports.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reports uploaded yet</h3>
                  <p className="text-muted-foreground">Start by uploading your first lab report</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockReports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-white text-xs font-bold">JD</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">Date Uploaded</p>
                          <p className="font-semibold">{report.date}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Hb Value:</span>
                            <span className="text-lg font-bold text-primary">{report.hbValue} g/dL</span>
                          </div>
                        </div>

                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>

                        <Button 
                          variant="gradient" 
                          className="w-full"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Report View Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report - {selectedReport?.date}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <FileText className="h-24 w-24 text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
