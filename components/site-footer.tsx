import Link from "next/link"

export function SiteFooter() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-5 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
            <p className="text-xs text-muted-foreground">
                © 2026 Учебный проект q0tya и YSimatov. Все права защищены.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link className="text-xs text-muted-foreground hover:underline underline-offset-4" href="#">
                    Пользовательское соглашение
                </Link>
                <Link className="text-xs text-muted-foreground hover:underline underline-offset-4" href="#">
                    Конфиденциальность
                </Link>
            </nav>
        </footer>
    )
}
