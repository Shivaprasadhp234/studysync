"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { isSignedIn, user } = useUser();

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link href="/" className="font-bold text-2xl tracking-tight">
                    StudySync
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
                        Resources
                    </Link>
                    {isSignedIn ? (
                        <div className="flex items-center gap-4">
                            <Link href="/upload" className="text-sm font-medium transition-colors hover:text-primary">
                                Upload
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )}
                    {/* <ModeToggle /> We can add this later */}
                </div>
            </div>
        </nav>
    );
}
