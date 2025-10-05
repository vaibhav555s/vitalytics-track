import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Share2, Phone, Mail } from "lucide-react";
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

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Hematologist",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@hospital.com",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Internal Medicine",
    phone: "+1 (555) 234-5678",
    email: "michael.chen@clinic.com",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "General Practitioner",
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@health.com",
    avatar: "ER"
  }
];

export default function DoctorConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: ""
  });

  const handleShareReport = (doctorName: string) => {
    toast.success(`Report shared with ${doctorName}`);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Doctor added successfully!");
    setIsModalOpen(false);
    setFormData({ name: "", specialization: "", phone: "", email: "" });
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Doctors</h1>
                  <p className="text-muted-foreground">Manage your healthcare providers</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="gradient">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Doctor</DialogTitle>
                      <DialogDescription>
                        Enter the details of your healthcare provider
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDoctor} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" variant="gradient" className="w-full">
                        Add Doctor
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-shadow">
                      <div className="text-center mb-4">
                        <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-white">{doctor.avatar}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleShareReport(doctor.name)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Report
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
