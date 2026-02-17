import { upsertProfile } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // We might need to install this or use standard label

export default function CompleteProfilePage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        Please provide your academic details to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={upsertProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="full_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                            <Input
                                id="full_name"
                                name="full_name"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="college_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">College Name</label>
                            <Input
                                id="college_name"
                                name="college_name"
                                placeholder="Example University"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="branch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Branch</label>
                            <Input
                                id="branch"
                                name="branch"
                                placeholder="Computer Science"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="semester" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Semester</label>
                            <Input
                                id="semester"
                                name="semester"
                                placeholder="3rd"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Save Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
