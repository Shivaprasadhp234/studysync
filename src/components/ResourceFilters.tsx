"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ResourceFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 500);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        replace(pathname);
    };

    const hasFilters = searchParams.toString().length > 0;

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search title, subject, or description..."
                        className="pl-10"
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get("search")?.toString()}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[180px]">
                        <Select
                            onValueChange={(val) => handleFilterChange("sortBy", val)}
                            defaultValue={searchParams.get("sortBy")?.toString() || "newest"}
                        >
                            <SelectTrigger>
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {hasFilters && (
                        <Button variant="ghost" onClick={handleReset} className="h-10">
                            <X className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters:
                </div>

                <Select
                    onValueChange={(val) => handleFilterChange("semester", val)}
                    defaultValue={searchParams.get("semester")?.toString()}
                >
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
                            <SelectItem key={sem} value={sem}>{sem}th Semester</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={(val) => handleFilterChange("branch", val)}
                    defaultValue={searchParams.get("branch")?.toString()}
                >
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {["CSE", "ISE", "ECE", "ME", "CV", "Other"].map((branch) => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={(val) => handleFilterChange("resource_type", val)}
                    defaultValue={searchParams.get("resource_type")?.toString()}
                >
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {["Note", "Question Paper", "Solution", "Project Report", "Other"].map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
