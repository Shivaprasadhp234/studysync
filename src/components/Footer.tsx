import { BookOpen } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t bg-muted/20 mt-20">
            <div className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            <span className="font-bold text-xl tracking-tight">StudySync</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Empowering campus communities through collaborative academic resource sharing.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/resources" className="hover:text-primary">All Resources</a></li>
                            <li><a href="/upload" className="hover:text-primary">Upload File</a></li>
                            <li><a href="/dashboard" className="hover:text-primary">Dashboard</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Community</h4>
                        <p className="text-sm text-muted-foreground italic">
                            "By students, for students."
                        </p>
                    </div>
                </div>
                
                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 StudySync. Built for Yugastr 2026.</p>
                    <p>Designed with ❤️ by Team StudySync</p>
                </div>
            </div>
        </footer>
    );
}
