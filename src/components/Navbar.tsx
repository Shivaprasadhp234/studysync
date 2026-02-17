"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { BookOpen, Upload, LayoutDashboard, Search } from "lucide-react";

export default function Navbar() {
    const { isSignedIn } = useUser();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="font-extrabold text-2xl tracking-tighter">StudySync</span>
                </Link>

                <div className="flex items-center space-x-6">
                    <Link
                        href="/resources"
                        className="text-sm font-semibold flex items-center gap-1 transition-colors hover:text-primary hidden sm:flex"
                    >
                        <Search className="w-4 h-4" />
                        Resources
                    </Link>

                    {isSignedIn ? (
                        <div className="flex items-center gap-4">
                            <Link href="/upload">
                                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                            <div className="w-[1px] h-6 bg-border mx-2" />
                            <ModeToggle />
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <ModeToggle />
                            <div className="flex items-center gap-2">
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
