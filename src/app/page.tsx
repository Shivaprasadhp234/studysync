import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Upload, Shield, Users, Trophy, Milestone, Globe, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4 animate-bounce">
            🚀 Yugastr 2026 Special
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Unlock Your <span className="text-primary">Campus Potential</span> with StudySync
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The ultimate collaborative hub for students to share notes, previous papers, and assignments securely. Build your legacy while helping others.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              <Link href="/resources" className="flex items-center gap-2">
                Browse Resources
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl border-2 transition-all hover:bg-accent/50 group">
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Upload Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Academic Notes", value: "500+", icon: BookOpen, color: "text-blue-500" },
              { label: "Previous Papers", value: "100+", icon: Milestone, color: "text-purple-500" },
              { label: "Branches Covered", value: "10+", icon: Globe, color: "text-emerald-500" },
            ].map((stat, i) => (
              <Card key={i} className="bg-background/50 backdrop-blur-sm border-none shadow-xs group cursor-default transition-all hover:shadow-lg">
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
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32">
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
              <div key={i} className="flex flex-col items-center text-center space-y-6 p-6 group">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-primary/20">
                  <feature.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-black">Ready to Start Syncing?</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Join hundreds of students in improving campus collaboration. Your notes could be the key to someone's success.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary-foreground/10">
            <Link href="/sign-up">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
