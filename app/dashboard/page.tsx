import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getUserExamHistory } from "@/app/actions/exam-actions"
import { LayoutDashboard, BookOpen, Trophy, ClipboardList, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DeleteMyAccountButton } from "@/components/dashboard/delete-account-button"

function ScoreBadge({ score, total }: { score: number; total: number }) {
    const pct = Math.round((score / total) * 100)
    const variant =
        pct >= 80 ? "default"
        : pct >= 50 ? "secondary"
        : "destructive"
    return (
        <Badge variant={variant} className="text-sm font-semibold px-3 py-1">
            {score}/{total} · {pct}%
        </Badge>
    )
}

export default async function DashboardPage() {
    const session = await auth()
    const user = session?.user

    const [attemptCount, totalTopics, examHistory] = await Promise.all([
        prisma.attempt.count({ where: { userId: user?.id } }),
        prisma.topic.count(),
        getUserExamHistory(),
    ])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <LayoutDashboard className="h-7 w-7" />
                    Личный кабинет
                </h1>
                <p className="text-muted-foreground mt-1">
                    Добро пожаловать, {user?.name || user?.email}!
                </p>
            </div>

            {/* ── Danger zone ── */}
            <div className="flex items-center justify-between border border-destructive/30 rounded-lg px-5 py-4 bg-destructive/5">
                <div>
                    <p className="font-medium text-sm">Удаление аккаунта</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Все ваши данные и результаты будут удалены безвозвратно.
                    </p>
                </div>
                <DeleteMyAccountButton />
            </div>

            {/* ── Stats row ── */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Роль</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user?.role === "ADMIN" ? "Администратор"
                                : user?.role === "TEACHER" ? "Преподаватель"
                                : "Учащийся"}
                        </div>
                        <p className="text-xs text-muted-foreground">Текущие права доступа</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Тестов самоконтроля</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attemptCount}</div>
                        <p className="text-xs text-muted-foreground">Пройдено попыток</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Экзаменов сдано</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{examHistory.length}</div>
                        <p className="text-xs text-muted-foreground">Из {totalTopics} доступных тем</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Exam history table ── */}
            <div>
                <h2 className="text-xl font-semibold mb-4">История экзаменов</h2>
                {examHistory.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground font-medium">Вы ещё не проходили экзаменов</p>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                Перейдите к теме и нажмите «Пройти экзамен»
                            </p>
                            <Button asChild variant="outline">
                                <Link href="/topics">Перейти к темам</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Тема</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Результат</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examHistory.map((attempt, i) => {
                                        const pct = Math.round((attempt.score / attempt.total) * 100)
                                        const rowColor =
                                            pct >= 80 ? "bg-green-50/40 dark:bg-green-950/10"
                                            : pct >= 50 ? "bg-yellow-50/40 dark:bg-yellow-950/10"
                                            : "bg-red-50/40 dark:bg-red-950/10"
                                        return (
                                            <tr
                                                key={attempt.id}
                                                className={cn("border-b last:border-0 hover:bg-muted/30 transition-colors", rowColor)}
                                            >
                                                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                                <td className="px-4 py-3 font-medium">{attempt.topic.title}</td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(attempt.createdAt).toLocaleDateString("ru-RU", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <ScoreBadge score={attempt.score} total={attempt.total} />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={`/exam/${attempt.topicId}`}>
                                                            Пройти снова
                                                            <ArrowRight className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
