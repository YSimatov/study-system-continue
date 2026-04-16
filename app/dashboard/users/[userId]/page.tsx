import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ClipboardList, BookOpen, Trophy, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    params: Promise<{ userId: string }>
}

function ScoreBadge({ score, total }: { score: number; total: number }) {
    const pct = Math.round((score / total) * 100)
    return (
        <Badge
            variant="outline"
            className={cn("border-0 font-semibold", {
                "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300": pct >= 80,
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300": pct >= 50 && pct < 80,
                "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300": pct < 50,
            })}
        >
            {pct}% ({score}/{total})
        </Badge>
    )
}

function fmtDate(d: Date) {
    return d.toLocaleDateString("ru-RU") + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

export default async function UserDetailsPage(props: Props) {
    const params = await props.params
    const session = await auth()

    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        redirect("/dashboard")
    }

    // Fetch user with full data
    const user = await prisma.user.findUnique({
        where: { id: params.userId },
        include: {
            attempts: {
                orderBy: { createdAt: "desc" },
                include: {
                    subtopic: { include: { topic: true } },
                    answers: { include: { question: true } }
                }
            },
            examAttempts: {
                orderBy: { createdAt: "desc" },
                include: { topic: true }
            }
        }
    })

    if (!user) notFound()

    // Compute stats
    const totalQuizzes = user.attempts.length
    const avgScore = totalQuizzes > 0
        ? Math.round(user.attempts.reduce((sum, a) => sum + Math.round((a.score / a.total) * 100), 0) / totalQuizzes)
        : 0
    const totalExams = user.examAttempts.length
    const avgExamScore = totalExams > 0
        ? Math.round(user.examAttempts.reduce((sum, a) => sum + Math.round((a.score / a.total) * 100), 0) / totalExams)
        : 0

    // Group quiz attempts by topic
    const byTopic = user.attempts.reduce<Record<string, { topicTitle: string; attempts: typeof user.attempts }>>((acc, a) => {
        const tid = a.subtopic.topic.id
        if (!acc[tid]) acc[tid] = { topicTitle: a.subtopic.topic.title, attempts: [] }
        acc[tid].attempts.push(a)
        return acc
    }, {})

    const roleLabel = user.role === "ADMIN" ? "Администратор"
        : user.role === "TEACHER" ? "Преподаватель"
        : "Учащийся"

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/users"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{user.name || "Без имени"}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{user.email}</span>
                        <span>·</span>
                        <Badge variant="secondary">{roleLabel}</Badge>
                    </div>
                </div>
            </div>

            {/* ── Stats cards ── */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Тестов пройдено</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalQuizzes}</div>
                        <p className="text-xs text-muted-foreground">Тесты самоконтроля</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Средний балл (тесты)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", {
                            "text-green-600": avgScore >= 80,
                            "text-yellow-600": avgScore >= 50 && avgScore < 80,
                            "text-red-600": avgScore < 50 && totalQuizzes > 0,
                        })}>{totalQuizzes > 0 ? `${avgScore}%` : "—"}</div>
                        <p className="text-xs text-muted-foreground">По всем попыткам</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Экзаменов сдано</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalExams}</div>
                        <p className="text-xs text-muted-foreground">По темам курса</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Средний балл (экзамены)</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", {
                            "text-green-600": avgExamScore >= 80,
                            "text-yellow-600": avgExamScore >= 50 && avgExamScore < 80,
                            "text-red-600": avgExamScore < 50 && totalExams > 0,
                        })}>{totalExams > 0 ? `${avgExamScore}%` : "—"}</div>
                        <p className="text-xs text-muted-foreground">По всем экзаменам</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Exam history ── */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5"/>
                        История экзаменов ({totalExams})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {totalExams === 0 ? (
                        <p className="text-muted-foreground text-sm">Экзамены ещё не сдавались.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Тема</TableHead>
                                    <TableHead>Результат</TableHead>
                                    <TableHead>Дата</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.examAttempts.map((ea, i) => (
                                    <TableRow key={ea.id}>
                                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                        <TableCell className="font-medium">{ea.topic.title}</TableCell>
                                        <TableCell><ScoreBadge score={ea.score} total={ea.total}/></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{fmtDate(ea.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ── Quiz history grouped by topic ── */}
            {totalQuizzes === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground text-sm">
                        Тесты самоконтроля ещё не проходились.
                    </CardContent>
                </Card>
            ) : (
                Object.values(byTopic).map(({ topicTitle, attempts }) => {
                    const topicAvg = Math.round(
                        attempts.reduce((sum, a) => sum + Math.round((a.score / a.total) * 100), 0) / attempts.length
                    )
                    return (
                        <Card key={topicTitle}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4"/>
                                        {topicTitle}
                                    </span>
                                    <Badge variant="outline" className={cn("font-semibold", {
                                        "border-green-500 text-green-600": topicAvg >= 80,
                                        "border-yellow-500 text-yellow-600": topicAvg >= 50 && topicAvg < 80,
                                        "border-red-500 text-red-600": topicAvg < 50,
                                    })}>
                                        Средний: {topicAvg}%
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Подтема</TableHead>
                                            <TableHead>Правильно</TableHead>
                                            <TableHead>Ошибок</TableHead>
                                            <TableHead>Результат</TableHead>
                                            <TableHead>Дата</TableHead>
                                            <TableHead className="text-right">Ответы</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attempts.map(attempt => {
                                            const wrong = attempt.answers.filter(a => !a.isCorrect).length
                                            return (
                                                <TableRow key={attempt.id}>
                                                    <TableCell className="font-medium">{attempt.subtopic.title}</TableCell>
                                                    <TableCell className="text-green-600 font-semibold">{attempt.score}</TableCell>
                                                    <TableCell className="text-red-500 font-semibold">{wrong}</TableCell>
                                                    <TableCell><ScoreBadge score={attempt.score} total={attempt.total}/></TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{fmtDate(attempt.createdAt)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button asChild variant="ghost" size="sm">
                                                            <Link href={`/result/${attempt.id}`}>
                                                                Просмотр ответов →
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )
                })
            )}
        </div>
    )
}
