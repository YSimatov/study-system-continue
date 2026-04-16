import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, LayoutDashboard, Users, HelpCircle, BookOpen } from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/auth/login")
    }

    const role = session.user.role

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex flex-1 container mx-auto px-4 py-6 gap-6">
                <aside className="hidden w-[200px] flex-col md:flex gap-2">
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Обзор</Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/topics"><BookOpen className="mr-2 h-4 w-4" /> Темы</Link>
                    </Button>
                    {(role === "ADMIN" || role === "TEACHER") && (
                        <>
                            <div className="px-4 py-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Управление
                                </h4>
                            </div>
                            <Button asChild variant="ghost" className="justify-start">
                                <Link href="/dashboard/topics"><FileText className="mr-2 h-4 w-4" /> Темы</Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start">
                                <Link href="/dashboard/questions"><HelpCircle className="mr-2 h-4 w-4" /> Вопросы</Link>
                            </Button>
                        </>
                    )}
                    {(role === "ADMIN" || role === "TEACHER") && (
                        <Button asChild variant="ghost" className="justify-start">
                            <Link href="/dashboard/users"><Users className="mr-2 h-4 w-4" /> Пользователи</Link>
                        </Button>
                    )}
                </aside>
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
