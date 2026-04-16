"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ─── Get exam questions: 3 random per subtopic (no isCorrect sent to client) ───
export async function getExamData(topicId: string) {
    const session = await auth()
    if (!session?.user) return null

    // Fetch all subtopics with their questions/options
    const subtopics = await prisma.subtopic.findMany({
        where: { topicId },
        include: {
            questions: {
                include: {
                    options: {
                        select: { id: true, text: true } // ← no isCorrect!
                    }
                }
            }
        },
        orderBy: { createdAt: "asc" }
    })

    // Pick 3 random questions per subtopic
    const examQuestions = subtopics.flatMap(sub => {
        const shuffled = [...sub.questions].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 3).map(q => ({
            ...q,
            subtopicTitle: sub.title
        }))
    })

    // Shuffle the full list so questions from different subtopics mix
    return examQuestions.sort(() => Math.random() - 0.5)
}

// ─── Submit exam: calculate score, save ExamAttempt, redirect to dashboard ───
const submitExamSchema = z.object({
    topicId: z.string(),
    answers: z.array(z.object({
        questionId: z.string(),
        optionId: z.string(),
    }))
})

export async function submitExam(values: z.infer<typeof submitExamSchema>) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Не авторизован" }
    }

    const { topicId, answers } = submitExamSchema.parse(values)

    // Fetch all questions with correct options server-side only
    const questionIds = answers.map(a => a.questionId)
    const questions = await prisma.question.findMany({
        where: { id: { in: questionIds } },
        include: { options: { select: { id: true, isCorrect: true } } }
    })

    // Calculate score (never sent to client before this)
    let score = 0
    const total = answers.length

    for (const ans of answers) {
        const question = questions.find(q => q.id === ans.questionId)
        if (!question) continue
        const selectedOption = question.options.find(o => o.id === ans.optionId)
        if (selectedOption?.isCorrect) score++
    }

    // Save ExamAttempt — only score/total, no answer details
    await prisma.examAttempt.create({
        data: {
            userId: session.user.id,
            topicId,
            score,
            total,
        }
    })

    revalidatePath("/dashboard")

    return { success: true, score, total }
}

// ─── Get user's exam history for dashboard ───
export async function getUserExamHistory() {
    const session = await auth()
    if (!session?.user?.id) return []

    const attempts = await prisma.examAttempt.findMany({
        where: { userId: session.user.id },
        include: {
            topic: { select: { id: true, title: true, slug: true } }
        },
        orderBy: { createdAt: "desc" }
    })

    return attempts
}
