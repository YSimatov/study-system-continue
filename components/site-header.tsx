import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"
import { Monitor } from "lucide-react"

export async function SiteHeader() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 mx-auto">
                <Link href={session?.user ? "/dashboard" : "/"} className="mr-6 flex items-center space-x-2">
                    <Monitor className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">InfoSys Learn</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/topics" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Темы
                    </Link>
                    <Link href="/use-case" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Use Case
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    {session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">Войти</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm">Начать</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
