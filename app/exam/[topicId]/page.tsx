import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { ExamForm } from "@/components/exam/exam-form"
import { getExamData } from "@/app/actions/exam-actions"
import { prisma } from "@/lib/prisma"
import { BookOpen, Clock, HelpCircle } from "lucide-react"

interface Props {
    params: Promise<{ topicId: string }>
}

export default async function ExamPage(props: Props) {
    const params = await props.params
    const session = await auth()
    if (!session) redirect("/auth/login")

    const topic = await prisma.topic.findUnique({
        where: { id: params.topicId },
        include: { subtopics: { select: { id: true } } }
    })

    if (!topic) notFound()

    const questions = await getExamData(params.topicId)

    if (!questions || questions.length === 0) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 container mx-auto px-4 py-8 text-center max-w-2xl">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Экзамен: {topic.title}</h1>
                    <p className="text-muted-foreground">
                        Вопросы для экзамена ещё не добавлены. Обратитесь к преподавателю.
                    </p>
                </main>
            </div>
        )
    }

    const subtopicCount = topic.subtopics.length

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">
                        Экзамен: {topic.title}
                    </h1>
                    <p className="text-muted-foreground mb-5">
                        Тест на проверку знаний по всем разделам темы
                    </p>

                    {/* Info cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
                            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Вопросов</p>
                                <p className="font-semibold text-sm">{questions.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
                            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Подтем</p>
                                <p className="font-semibold text-sm">{subtopicCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">~Время</p>
                                <p className="font-semibold text-sm">{Math.ceil(questions.length * 0.75)} мин</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                        ⚠️ Правильные и неправильные ответы <strong>не отображаются</strong> ни во время, ни после прохождения. Результат будет сохранён в вашем личном кабинете.
                    </div>
                </div>

                <ExamForm
                    topicId={topic.id}
                    topicTitle={topic.title}
                    questions={questions}
                />
            </main>
        </div>
    )
}
