import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ExamSettingsClient } from "@/components/dashboard/exam-settings-client"
import { ClipboardEdit } from "lucide-react"

export default async function DashboardExamPage() {
    const session = await auth()
    if (session?.user.role === "STUDENT") redirect("/dashboard")

    const topics = await prisma.topic.findMany({
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            examMode: true,
            questionsPerSubtopic: true,
            subtopics: {
                orderBy: { createdAt: "asc" },
                select: {
                    id: true,
                    title: true,
                    questions: {
                        orderBy: { createdAt: "asc" },
                        select: {
                            id: true,
                            text: true,
                            inExam: true,
                            options: {
                                select: {
                                    id: true,
                                    text: true,
                                    isCorrect: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ClipboardEdit className="h-6 w-6" />
                    Настройки экзамена
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Выберите режим формирования экзамена для каждой темы. В режиме{" "}
                    <strong>«Случайный»</strong> система выбирает N случайных вопросов из каждой подтемы.
                    В режиме <strong>«Фиксированный»</strong> в экзамен входят только отмеченные галочкой вопросы.
                </p>
            </div>

            <ExamSettingsClient topics={topics} />
        </div>
    )
}
