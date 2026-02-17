"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Upload, Shield, Users, Trophy, Milestone, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { NeuralBg } from "@/components/Visuals/NeuralBg";
import { TiltCard } from "@/components/Visuals/TiltCard";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <NeuralBg />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background -z-20" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 text-center space-y-8"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-primary/20">
              🚀 Yugastr 2026 Special
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Unlock Your <span className="text-primary lg:inline-block">Campus Potential</span> with StudySync
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            The ultimate collaborative hub for students to share notes, previous papers, and assignments securely. Build your legacy while helping others.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 group">
                <Link href="/resources" className="flex items-center gap-2">
                  Browse Resources
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl border-2 group bg-background/50 backdrop-blur-sm">
                <Link href="/upload" className="flex items-center gap-2">
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Upload Now
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Academic Notes", value: "500+", icon: BookOpen, color: "text-blue-500" },
              { label: "Previous Papers", value: "100+", icon: Milestone, color: "text-purple-500" },
              { label: "Branches Covered", value: "10+", icon: Globe, color: "text-emerald-500" },
            ].map((stat, i) => (
              <TiltCard key={i}>
                <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-xs group cursor-default transition-all hover:bg-background/80">
                  <CardContent className="flex items-center gap-6 p-8">
                    <div className={`p-4 rounded-2xl bg-muted group-hover:bg-background transition-colors ${stat.color}`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-3xl font-black">{stat.value}</div>
                      <div className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Built for Modern Education</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Experience a platform focused on security, community, and rewarding excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "College-Locked Privacy",
                desc: "Keep your resources safe. Control who views your uploads with robust privacy controls.",
                icon: Shield,
              },
              {
                title: "Verified Peer Reviews",
                desc: "Trust the content you download. Peer reviews ensure high quality for every shared document.",
                icon: Users,
              },
              {
                title: "Recognition Points",
                desc: "Get rewarded for your contributions. Climb the leaderboard and earn campus respect.",
                icon: Trophy,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-6 p-6 group"
              >
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-primary/20">
                  <feature.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="container mx-auto px-4 text-center space-y-8 text-primary-foreground">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black"
          >
            Ready to Start Syncing?
          </motion.h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Join hundreds of students in improving campus collaboration. Your notes could be the key to someone's success.
          </p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary-foreground/10">
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-muted/20 border-t">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-10">Powering the Platform</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="font-bold text-xl">Next.js 15</div>
            <div className="font-bold text-xl">React 19</div>
            <div className="font-bold text-xl">Tailwind 4</div>
            <div className="font-bold text-xl">Supabase</div>
            <div className="font-bold text-xl">Clerk</div>
            <div className="font-bold text-xl">Framer Motion</div>
          </div>
        </div>
      </section>
    </div>
  );
}

