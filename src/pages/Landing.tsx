import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  MessageSquare, 
  Bell, 
  UserPlus, 
  Target, 
  Moon,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Hemoglobin Tracking",
    description: "Easily log and monitor your hemoglobin levels with intuitive charts and insights."
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Get instant answers to your health questions from our intelligent assistant."
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Receive timely reminders and notifications about your health milestones."
  },
  {
    icon: UserPlus,
    title: "Doctor Connect",
    description: "Share your health data securely with healthcare professionals."
  },
  {
    icon: Target,
    title: "Gamified Goals",
    description: "Stay motivated with achievements and personalized health goals."
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description: "Comfortable viewing experience with seamless light and dark themes."
  }
];

const floatingIcons = [
  { Icon: Activity, delay: 0, x: "10%", y: "20%" },
  { Icon: Activity, delay: 1, x: "80%", y: "15%" },
  { Icon: Activity, delay: 0.5, x: "15%", y: "70%" },
  { Icon: Activity, delay: 1.5, x: "85%", y: "65%" },
  { Icon: Activity, delay: 0.7, x: "50%", y: "80%" },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute opacity-10"
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <item.Icon className="h-16 w-16" />
          </motion.div>
        ))}

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Track Your Health,{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--primary-start))] to-[hsl(var(--primary-end))] bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Monitor your hemoglobin levels, receive smart insights, and take control of your health journey with our modern tracking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="gradient" size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features to help you manage your health data with confidence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6" />
                HemoTrack
              </h3>
              <p className="text-slate-400">
                Your personal health tracking companion for a healthier tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 HemoTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
