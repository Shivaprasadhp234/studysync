import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getResources } from "@/lib/resources";
import { UserResourcesTable } from "@/components/UserResourcesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, FileText, Star, TrendingUp, Award } from "lucide-react";
import Link from 'next/link';

async function getUserStats(userId: string) {
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();

    const { data: resources } = await supabaseAdmin
        .from('resources')
        .select(`
            id, 
            title, 
            created_at, 
            privacy, 
            file_url,
            reviews!resource_id(rating)
        `)
        .eq('uploader_id', userId);

    if (!resources) return { points: profile?.points || 0, uploads: [], avgRating: 0 };

    const processedResources = resources.map(r => {
        const ratings = r.reviews || [];
        const avg_rating = ratings.length > 0
            ? Math.round((ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length) * 10) / 10
            : 0;
        return { ...r, avg_rating };
    });

    const totalRatingSum = processedResources.reduce((acc, curr) => acc + (curr.avg_rating || 0), 0);
    const resourcesWithRatings = processedResources.filter(r => r.avg_rating && r.avg_rating > 0).length;
    const overallAvg = resourcesWithRatings > 0 ? Math.round((totalRatingSum / resourcesWithRatings) * 10) / 10 : 0;

    return {
        points: profile?.points || 0,
        uploads: processedResources,
        avgRating: overallAvg
    };
}

function getLevelInfo(points: number) {
    if (points >= 200) return { label: "Campus Legend", color: "bg-purple-500", icon: Trophy };
    if (points >= 51) return { label: "Contributor", color: "bg-blue-500", icon: Award };
    return { label: "Newbie", color: "bg-slate-500", icon: TrendingUp };
}

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold">Please sign in to view your dashboard</h2>
                <Link href="/sign-in" className="text-primary hover:underline mt-4 inline-block">Sign In</Link>
            </div>
        );
    }

    const { points, uploads, avgRating } = await getUserStats(userId);
    const level = getLevelInfo(points);
    const LevelIcon = level.icon;

    const stats = [
        {
            title: "Total Uploads",
            value: uploads.length,
            icon: FileText,
            description: "Resources shared with the community",
            color: "text-blue-600"
        },
        {
            title: "Recognition Points",
            value: points,
            icon: Award,
            description: `Level: ${level.label}`,
            color: "text-purple-600"
        },
        {
            title: "Average Quality",
            value: avgRating > 0 ? `${avgRating}/5` : "N/A",
            icon: Star,
            description: "Based on community reviews",
            color: "text-amber-500"
        }
    ];

    return (
        <div className="container mx-auto py-10 px-4 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
                    <p className="text-muted-foreground">Manage your uploads and track your impact.</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold shadow-lg ${level.color}`}>
                    <LevelIcon className="w-5 h-5" />
                    {level.label}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground italic">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resources List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">My Resources</h2>
                    <Link href="/upload" className="text-primary text-sm font-medium hover:underline">
                        + Upload New
                    </Link>
                </div>
                <UserResourcesTable resources={uploads} />
            </div>
        </div>
    );
}
