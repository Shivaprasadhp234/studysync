"use client";

import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPlayerLevel } from "@/lib/gamification";

interface Profile {
    id: string;
    full_name: string;
    points: number;
    branch?: string;
    college_name?: string;
}

export function RankTable({ users, currentUserId }: { users: Profile[], currentUserId?: string | null }) {
    return (
        <div className="relative border rounded-2xl overflow-hidden bg-background/50 backdrop-blur-md group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            {/* Neural Scanning Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 animate-neural-scan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/50">
                        <TableHead className="w-20 text-center font-bold">Rank</TableHead>
                        <TableHead className="font-bold">Contributor</TableHead>
                        <TableHead className="hidden md:table-cell font-bold">Branch</TableHead>
                        <TableHead className="text-right font-bold">Level</TableHead>
                        <TableHead className="text-right font-bold">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => {
                        const rank = index + 1;
                        const isMe = user.id === currentUserId;
                        const level = getPlayerLevel(user.points || 0);

                        return (
                            <TableRow
                                key={user.id}
                                className={`group transition-colors border-b border-border/30 ${isMe ? "bg-primary/5" : "hover:bg-muted/50"}`}
                            >
                                <TableCell className="text-center font-black opacity-50">
                                    #{rank}
                                </TableCell>
                                <TableCell className="font-bold">
                                    <div className="flex flex-col">
                                        <span>{user.full_name}</span>
                                        <span className="text-[10px] text-muted-foreground md:hidden">{user.branch}</span>
                                    </div>
                                    {isMe && <Badge variant="outline" className="ml-2 text-[10px] py-0">You</Badge>}
                                </TableCell>
                                <TableCell className="hidden md:table-cell font-medium opacity-70">
                                    {user.branch || "General"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${level.color}`}>
                                        {level.name}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-black tabular-nums">
                                    {user.points || 0}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
