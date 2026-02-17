import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Lock, Star } from "lucide-react";
import Link from "next/link";

interface Resource {
    id: string;
    title: string;
    resource_type: string;
    subject: string;
    semester: string;
    branch: string;
    file_url: string;
    privacy: "public" | "private";
    avg_rating?: number;
    uploader: {
        full_name: string;
        college_name?: string;
    } | null;
}

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <Link href={`/resources/${resource.id}`} className="hover:underline">
                            <CardTitle className="text-lg font-semibold line-clamp-1" title={resource.title}>
                                {resource.title}
                            </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-1 text-xs mt-1">
                            by {resource.uploader?.full_name || "Unknown"}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {resource.privacy === 'private' && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-100 shrink-0">
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                            </Badge>
                        )}
                        {resource.avg_rating ? (
                            <div className="flex items-center text-amber-500 font-bold text-sm">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                {resource.avg_rating}
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{resource.resource_type}</Badge>
                    <Badge variant="outline">{resource.subject}</Badge>
                </div>
                <div className="text-sm text-muted-foreground grid grid-cols-2 gap-y-1">
                    <div className="flex items-center">
                        <span className="font-medium mr-1">Sem:</span> {resource.semester}
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium mr-1">Branch:</span> {resource.branch}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0 gap-2">
                <Button asChild className="flex-1" variant="outline" size="sm">
                    <Link href={`/resources/${resource.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                    </Link>
                </Button>
                <Button asChild className="flex-1" variant="default" size="sm">
                    <Link href={resource.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Get File
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
