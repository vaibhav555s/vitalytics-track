import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Upload, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReports, useUploadReport, useDeleteReport } from "@/hooks/useReports";
import { useReadings } from "@/hooks/useReadings";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReadingId, setSelectedReadingId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: reports = [], isLoading } = useReports();
  const { data: readings = [] } = useReadings();
  const uploadReport = useUploadReport();
  const deleteReport = useDeleteReport();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadReport.mutateAsync({
        file,
        readingId: selectedReadingId || undefined,
      });
      toast({
        title: "Report uploaded",
        description: "Your lab report has been uploaded successfully",
      });
      setSelectedReadingId("");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      await deleteReport.mutateAsync(reportId);
      toast({
        title: "Report deleted",
        description: "Your report has been deleted",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileType = (url: string) => {
    if (url.includes('.pdf')) return 'pdf';
    return 'image';
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
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Reports</h1>
                  <p className="text-muted-foreground">View and manage your uploaded lab reports</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedReadingId} onValueChange={setSelectedReadingId}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Link to reading (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No reading</SelectItem>
                      {readings.map((reading) => (
                        <SelectItem key={reading.id} value={reading.id}>
                          {format(new Date(reading.reading_date), "MMM d, yyyy")} - {reading.value} {reading.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="gradient"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Report
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reports.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reports uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">Start by uploading your first lab report</p>
                  <Button
                    variant="gradient"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Your First Report
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reports.map((report: any) => (
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">Date Uploaded</p>
                          <p className="font-semibold">
                            {format(new Date(report.uploaded_at), "MMMM d, yyyy")}
                          </p>
                          {report.file_name && (
                            <p className="text-sm text-muted-foreground truncate">
                              {report.file_name}
                            </p>
                          )}
                          {report.readings && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Linked Reading:</span>
                              <span className="text-lg font-bold text-primary">
                                {report.readings.value} {report.readings.unit}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {getFileType(report.file_url) === 'image' ? (
                            <img 
                              src={report.file_url} 
                              alt="Report preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          )}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Report - {selectedReport && format(new Date(selectedReport.uploaded_at), "MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              {selectedReport?.file_name || "Lab report document"}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {selectedReport && getFileType(selectedReport.file_url) === 'image' ? (
              <img 
                src={selectedReport.file_url} 
                alt="Report"
                className="w-full h-full object-contain"
              />
            ) : selectedReport && getFileType(selectedReport.file_url) === 'pdf' ? (
              <iframe
                src={selectedReport.file_url}
                className="w-full h-full min-h-[500px]"
                title="Report PDF"
              />
            ) : (
              <div className="text-center">
                <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                <Button
                  variant="gradient"
                  onClick={() => window.open(selectedReport?.file_url, '_blank')}
                >
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
