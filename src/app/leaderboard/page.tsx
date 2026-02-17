import { auth } from "@clerk/nextjs/server";
import { getLeaderboard, getUserRank } from "@/lib/user";
import { Podium } from "@/components/Leaderboard/Podium";
import { RankTable } from "@/components/Leaderboard/RankTable";
import { getPlayerLevel } from "@/lib/gamification";
import { NeuralBg } from "@/components/Visuals/NeuralBg";
import { Trophy, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function LeaderboardPage() {
    const { userId } = await auth();
    const leaderboard = await getLeaderboard(20);
    const myRankData = userId ? await getUserRank(userId) : null;

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="flex flex-col min-h-screen relative">
            <NeuralBg />

            <div className="container mx-auto px-4 py-24 space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black tracking-tight uppercase italic flex items-center justify-center gap-4">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                        Campus <span className="text-primary italic">Leaderboard</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Celebrating the top contributors driving campus collaboration. Are you the next campus legend?
                    </p>
                </div>

                {/* My Rank Highlight */}
                {myRankData && (
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-primary/5 border-primary/20 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/20 p-3 rounded-2xl">
                                        <Target className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest opacity-70">Your Personal Status</h3>
                                        <p className="text-2xl font-black">Rank #{myRankData.rank}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-xs font-bold uppercase opacity-50">Points</p>
                                        <p className="text-2xl font-black text-primary">{myRankData.points}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold uppercase opacity-50">Level</p>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ring-inset ${getPlayerLevel(myRankData.points).color}`}>
                                            {getPlayerLevel(myRankData.points).name}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2 text-xs font-bold bg-muted px-4 py-2 rounded-full border border-border/50">
                                        <Award className="w-4 h-4 text-primary" />
                                        Keep uploading to climb!
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Top 3 Podium */}
                <section>
                    <Podium topThree={topThree} />
                </section>

                {/* Detailed Rankings */}
                <section className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Full Rankings
                        </h2>
                        <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Showing Top 20</span>
                    </div>
                    <RankTable users={leaderboard} currentUserId={userId} />
                </section>
            </div>
        </div>
    );
}
