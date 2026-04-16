import { SiteHeader } from "@/components/site-header"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from "@/components/ui/card"
import { QuizForm } from "@/components/quiz/quiz-form"
import { getQuizData } from "@/app/actions/quiz-actions"
import Link from "next/link"
import { BookOpen, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    params: Promise<{
        topicSlug: string
        subtopicSlug: string
    }>
    searchParams: Promise<{ tab?: string }>
}

export default async function SubtopicPage(props: Props) {
    const params = await props.params
    const searchParams = await props.searchParams
    const activeTab = searchParams?.tab === "quiz" ? "quiz" : "theory"

    const session = await auth()

    const subtopic = await prisma.subtopic.findFirst({
        where: {
            slug: params.subtopicSlug,
            topic: { slug: params.topicSlug }
        },
        include: { topic: true }
    })

    if (!subtopic) notFound()

    // Load quiz data only when quiz tab is active
    const questions = activeTab === "quiz" ? await getQuizData(subtopic.id) : null

    const baseUrl = `/topics/${params.topicSlug}/${params.subtopicSlug}`

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">

                {/* Breadcrumbs */}
                <nav className="flex text-sm text-muted-foreground mb-6 gap-2">
                    <Link href="/topics" className="hover:underline">Темы</Link>
                    <span>/</span>
                    <Link href={`/topics/${subtopic.topic.slug}`} className="hover:underline">
                        {subtopic.topic.title}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{subtopic.title}</span>
                </nav>

                <h1 className="text-3xl font-bold mb-6">{subtopic.title}</h1>

                {/* ── Tab navigation ── */}
                <div className="flex border-b mb-6">
                    <Link
                        href={`${baseUrl}?tab=theory`}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                            activeTab === "theory"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Теоретический материал
                    </Link>
                    <Link
                        href={`${baseUrl}?tab=quiz`}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                            activeTab === "quiz"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                        )}
                    >
                        <ClipboardList className="h-4 w-4" />
                        Тест самоконтроля
                    </Link>
                </div>

                {/* ── Theory tab ── */}
                {activeTab === "theory" && (
                    <Card>
                        <CardContent className="prose dark:prose-invert max-w-none pt-6 pb-8">
                            {subtopic.contentMarkdown ? (
                                <ReactMarkdown>{subtopic.contentMarkdown}</ReactMarkdown>
                            ) : (
                                <p className="italic text-muted-foreground">Материал отсутствует.</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ── Quiz tab ── */}
                {activeTab === "quiz" && (
                    <>
                        {!session ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <p>Войдите в систему, чтобы пройти тест.</p>
                                    <Link href="/auth/login" className="text-primary underline mt-2 inline-block">
                                        Войти
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : !questions || questions.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <p>Вопросы для этого теста ещё не добавлены.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <QuizForm subtopicId={subtopic.id} questions={questions} />
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
