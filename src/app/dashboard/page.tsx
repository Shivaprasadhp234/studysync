import { auth } from "@clerk/nextjs/server";
import { checkProfile } from "@/lib/user";
import { getResources } from "@/lib/resources";
import { ResourceCard } from "@/components/ResourceCard";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Download, Eye } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const profile = await checkProfile();
    if (!profile) {
        redirect("/complete-profile");
    }

    // Reuse getResources? No, we need a special "My Resources" fetch or filter.
    // For now, let's fetch all and filter client-side or add a specific backend function.
    // Better to add a backend function for efficiency.

    const allResources = await getResources();
    const myResources = allResources.filter(r => r.uploader?.full_name === profile.full_name); // simplistic filter

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {profile.full_name}</h1>
                    <p className="text-muted-foreground">{profile.college_name} | {profile.branch} | Semester {profile.semester}</p>
                </div>
                <Link href="/upload">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Upload Resource
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myResources.length}</div>
                    </CardContent>
                </Card>
                {/* Placeholders for future stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4">My Uploaded Resources</h2>
            {myResources.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">You haven't uploaded any resources yet.</p>
                    <Link href="/upload">
                        <Button variant="outline">Share your first resource</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
}
