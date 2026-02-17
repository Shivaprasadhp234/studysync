"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { seedDemoData } from "@/lib/seed-demo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SeedDemoButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeed = async () => {
        setLoading(true);
        try {
            const result = await seedDemoData();
            toast.success(`Successfully seeded ${result.count} demo resources!`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to seed data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSeed} 
            disabled={loading}
            className="gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {loading ? "Seeding..." : "Seed Demo Data"}
        </Button>
    );
}
