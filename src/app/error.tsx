'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
            <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    An unexpected error occurred. We've been notified and are working to fix it.
                    <br />
                    <span className="text-xs italic">({error.message || "Internal Server Error"})</span>
                </p>
            </div>
            <Button onClick={() => reset()} className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Try again
            </Button>
        </div>
    )
}
