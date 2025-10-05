import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AddReading() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("g/dL");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mood, setMood] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value) {
      toast.error("Please enter a hemoglobin value");
      return;
    }

    toast.success("Reading saved successfully!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
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
            >
              <h1 className="text-3xl font-bold mb-2">Add New Reading</h1>
              <p className="text-muted-foreground mb-8">Record your latest hemoglobin measurement</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Manual Entry Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Hemoglobin Value *</Label>
                        <Input
                          id="value"
                          type="number"
                          step="0.1"
                          placeholder="13.5"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={unit} onValueChange={setUnit}>
                          <SelectTrigger id="unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g/dL">g/dL</SelectItem>
                            <SelectItem value="g/L">g/L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any relevant notes about this reading..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Mood Tracking */}
                    <div className="space-y-3">
                      <Label>How are you feeling today?</Label>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          { emoji: "😊", label: "Great", value: "great" },
                          { emoji: "🙂", label: "Good", value: "good" },
                          { emoji: "😐", label: "Okay", value: "okay" },
                          { emoji: "😟", label: "Tired", value: "tired" },
                          { emoji: "😢", label: "Unwell", value: "unwell" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              mood === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-3xl">{option.emoji}</span>
                            <span className="text-xs font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Report Upload Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Report (Optional)</h2>
                  
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your report here, or{" "}
                        <span className="text-primary font-medium">browse</span>
                      </p>
                      {file && (
                        <p className="text-sm text-primary font-medium mt-2">
                          Selected: {file.name}
                        </p>
                      )}
                    </label>
                  </div>
                </Card>

                {/* Voice Input Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Voice Input</h2>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full hover:scale-105 transition-transform"
                    onClick={() => toast.info("Voice input coming soon! Stay tuned.")}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Or speak your reading
                  </Button>
                </Card>

                {/* Submit Button */}
                <Button type="submit" variant="gradient" size="lg" className="w-full">
                  Save Reading
                </Button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
