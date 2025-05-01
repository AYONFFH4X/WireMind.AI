"use client";

import type React from "react";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Workflow,
  BarChart3,
  ShieldCheckIcon,
  Users2,
  Puzzle,
  HeadsetIcon,
  Building2,
  DollarSign,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import useUserAuth from "@/hooks/userAuth";
import Navbar from "./_components/Navbar";

const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "email profile", // Add 'profile' scope
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) console.error("Google login error:", error.message);
};

// Animation for blinking cursor
const blink = {
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0 },
};

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const router = useRouter();

  const gridX = useSpring(mouseX, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });
  const gridY = useSpring(mouseY, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  // For the typewriter effect
  const [displayText, setDisplayText] = useState("");
  const fullText = ".AI";

  // For the count up animation
  const [projectsCount, setProjectsCount] = useState(0);
  const [deploymentCount, setDeploymentCount] = useState(0);
  const [securityCount, setSecurityCount] = useState(0);

  // Preloader state
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useUserAuth();

  useEffect(() => {
    console.log("user from home", user);
  }, [user]);

  useEffect(() => {
    // Mouse move effect for the grid
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(((e.clientX - centerX) / centerX) * 20);
      mouseY.set(((e.clientY - centerY) / centerY) * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Typewriter effect
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 150);

    // Count up animations
    const animateCount = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      end: number,
      duration: number
    ) => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setter(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    animateCount(setProjectsCount, 1234, 2000);
    animateCount(setDeploymentCount, 5678, 2000);
    animateCount(setSecurityCount, 99, 2000);

    // Preloader timeout
    const preloaderTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(typeInterval);
      clearTimeout(preloaderTimeout);
    };
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 sm:p-6 lg:p-8"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex items-center gap-1 sm:gap-2"
          >
            <span className="text-4xl sm:text-5xl lg:text-6xl font-semibold bg-white text-black px-3 sm:px-4">
              WireMind
            </span>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              .AI
            </span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={targetRef}
      className="min-h-screen bg-transparent text-white overflow-hidden select-none"
    >
      {/* Background with grid */}
      <Navbar />
      <motion.div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px)",
            x: gridX,
            y: gridY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-[90%] sm:max-w-3xl mx-auto space-y-6 sm:space-y-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight flex flex-wrap items-center justify-center gap-2"
            >
              <span className="bg-white text-black px-2">WireMind</span>
              <span className="flex items-center">
                {displayText}
                <span className="w-[2px] h-[1em] bg-white animate-[blink_1s_ease-in-out_infinite]" />
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4"
            >
              The fastest and most effective way to start, test and validate
              your business idea with the help of AI
            </motion.p>
            {user ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center px-4"
              >
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="w-full sm:w-52 mt-4 sm:mt-8 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out text-base px-6 py-4 h-14 bg-transparent"
                >
                  Start now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center px-4"
              >
                <Button
                  onClick={handleGoogleLogin}
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-52 mt-4 sm:mt-8 bg-white text-black border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 ease-in-out text-base px-6 py-4 h-14"
                >
                  Register
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mx-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto space-y-12"
          >
            <div className="text-center px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
              >
                Our Impact in Numbers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base"
              >
                See how we transform businesses across the world
              </motion.p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 text-center"
              >
                <Users2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4 mx-auto" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {projectsCount.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Active Users
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="p-6 text-center"
              >
                <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4 mx-auto" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {deploymentCount.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Created Businesses
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 text-center"
              >
                <DollarSign className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4 mx-auto" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  ${(securityCount * 100000).toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Generated Revenue
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center p-2 flex justify-center items-center rounded-xl shadow-lg border-[1px] border-white">
              <Image
                src="/demo-app.png"
                alt="Logo"
                width={1800}
                height={800}
                className="w-full h-full object-cover rounded-xl "
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 px-4"
              >
                Powerful features for your business
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4"
              >
                Everything you need to grow your business and meet your
                customers
              </motion.p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  custom={index}
                >
                  <Card
                    role="button"
                    tabIndex={0}
                    className="p-4 sm:p-6 bg-transparent backdrop-blur-2xl border-gray-500 text-white blur-[0.4px] transition-transform duration-300 hover:scale-105 cursor-pointer h-full"
                  >
                    <feature.icon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
              >
                Simple and transparent pricing
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base"
              >
                Choose the ideal plan for your needs. Always know what you will
                pay.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Free Plan */}
              <motion.div variants={itemVariants}>
                <Card className="relative p-4 sm:p-6 bg-transparent backdrop-blur-2xl border-gray-500 text-white h-full">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold">
                      Free
                    </CardTitle>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Ideal for beginners
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-2xl sm:text-4xl font-bold">$0</span>
                      <span className="text-gray-400 ml-2 text-sm sm:text-base">
                        / month
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Basic ad creator
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Test ad creator
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        24/7 live chat
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full border-2 border-white text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-8 text-black bg-white hover:bg-transparent hover:text-white transition-all duration-300">
                      Започнете
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Pro Plan */}
              <motion.div variants={itemVariants}>
                <Card className="relative p-4 sm:p-6 bg-transparent backdrop-blur-2xl border-gray-500 text-white h-full">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold">
                      Pro
                    </CardTitle>
                    <p className="text-gray-400 text-sm sm:text-base">
                      For growing teams
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-2xl sm:text-4xl font-bold">
                        $4.99
                      </span>
                      <span className="text-gray-400 ml-2 text-sm sm:text-base">
                        / month
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        All free features
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Scalable ad creator
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Facebook ad analysis
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Priority support
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full border-2 border-white text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-8 text-black bg-white hover:bg-transparent hover:text-white transition-all duration-300">
                      Upgrade to Pro
                      <Zap className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Premium Plan */}
              <motion.div variants={itemVariants}>
                <Card className="relative p-4 sm:p-6 bg-transparent backdrop-blur-2xl border-gray-500 text-white h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white text-black text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold">
                      Premium
                    </CardTitle>
                    <p className="text-gray-400 text-sm sm:text-base">
                      For advanced users
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-2xl sm:text-4xl font-bold">
                        $29.99
                      </span>
                      <span className="text-gray-400 ml-2 text-sm sm:text-base">
                        / month
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        All Pro features
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Information about competition
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Expanded requests and suggestions
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        24/7 priority support
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-white flex-shrink-0" />
                        Personal account manager
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full border-2 border-white text-sm sm:text-lg py-4 sm:py-6 px-4 sm:px-8 text-black bg-white hover:bg-transparent hover:text-white transition-all duration-300">
                      Get Premium
                      <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-500 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-lg sm:text-xl font-semibold flex items-center gap-1">
                <span className="bg-white text-black px-2">WireMind</span>
                <span className="text-white">.AI</span>
              </span>
            </div>

            <div className="flex gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const features = [
  {
    title: "AI creator of ads",
    description: "Generate high-impact sales ads with our AI-powered system.",
    icon: Workflow,
  },
  {
    title: "Analysis of effectiveness of ads",
    description:
      "Get detailed insights into your Facebook ads campaigns and effectiveness metrics.",
    icon: BarChart3,
  },
  {
    title: "Safe data processing",
    description:
      "Your marketing data and customer information is always protected and encrypted.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Competitive analysis",
    description:
      "Stay ahead by analyzing competitor strategies and market positioning.",
    icon: Users2,
  },
  {
    title: "Marketing integrations",
    description:
      "Connect seamlessly with your favorite marketing tools and CRM systems.",
    icon: Puzzle,
  },
  {
    title: "Expert support",
    description:
      "Get assistance with your marketing strategy from our specialized support team.",
    icon: HeadsetIcon,
  },
];
