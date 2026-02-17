"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface Profile {
    id: string;
    full_name: string;
    points: number;
    branch?: string;
}

export function Podium({ topThree }: { topThree: Profile[] }) {
    // Reorder for visual podium: [2, 1, 3]
    const podiumOrder = [
        topThree[1], // Rank 2
        topThree[0], // Rank 1
        topThree[2], // Rank 2
    ].filter(Boolean);

    const configs = {
        0: { // First place in array (actually Rank 2)
            rank: 2,
            h: "h-48",
            color: "text-slate-400",
            bg: "bg-slate-400/10",
            border: "border-slate-400/20",
            glow: "shadow-[0_0_15px_rgba(148,163,184,0.3)]",
        },
        1: { // Second place in array (actually Rank 1)
            rank: 1,
            h: "h-64",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            glow: "shadow-[0_0_25px_rgba(234,179,8,0.4)]",
        },
        2: { // Third place in array (actually Rank 3)
            rank: 3,
            h: "h-40",
            color: "text-amber-700",
            bg: "bg-amber-700/10",
            border: "border-amber-700/20",
            glow: "shadow-[0_0_15px_rgba(180,83,9,0.3)]",
        }
    };

    return (
        <div className="flex flex-wrap items-end justify-center gap-4 md:gap-8 min-h-[300px] mb-12">
            {podiumOrder.map((user, idx) => {
                const config = configs[idx as keyof typeof configs];
                return (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className={`relative w-full sm:w-64 ${config.h} flex flex-col justify-end`}
                    >
                        <Card className={`h-full flex flex-col items-center justify-center space-y-4 border-2 ${config.border} ${config.bg} ${config.glow} backdrop-blur-sm relative overflow-hidden group`}>
                            {/* Neural Scanning Line Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-neural-scan opacity-0 group-hover:opacity-100" />

                            <div className={`p-4 rounded-full ${config.bg} border ${config.border}`}>
                                <Trophy className={`w-8 h-8 ${config.color}`} />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-lg truncate px-2">{user.full_name}</h3>
                                <Badge variant="secondary" className="font-black text-xl">
                                    {user.points} pts
                                </Badge>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Badge className={`${config.bg} ${config.color} border-none`}>
                                    Rank #{config.rank}
                                </Badge>
                                {config.rank === 1 && (
                                    <Badge variant="outline" className="text-[10px] animate-pulse">
                                        Top Contributor
                                    </Badge>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
