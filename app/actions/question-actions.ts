"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const questionSchema = z.object({
    subtopicId: z.string(),
    text: z.string().min(3),
    options: z.array(z.object({
        text: z.string().min(1),
        isCorrect: z.boolean()
    })).min(2)
})

export async function getQuestionsForSubtopic(subtopicId: string) {
    const session = await auth()
    if (session?.user?.role === 'STUDENT') return []

    return await prisma.question.findMany({
        where: { subtopicId },
        include: { options: true },
        orderBy: { createdAt: 'asc' }
    })
}

export async function createQuestion(values: z.infer<typeof questionSchema>) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        return { error: "Unauthorized" }
    }

    const { subtopicId, text, options } = questionSchema.parse(values)

    // Validate only one correct answer (for radio)
    const correctCount = options.filter(o => o.isCorrect).length
    if (correctCount !== 1) {
        return { error: "Exactly one option must be correct" }
    }

    try {
        await prisma.question.create({
            data: {
                subtopicId,
                text,
                options: {
                    create: options
                }
            }
        })
        revalidatePath('/dashboard/questions')
        return { success: "Question created" }
    } catch (e: any) {
        return { error: "Failed to create question" }
    }
}

export async function deleteQuestion(id: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        return { error: "Unauthorized" }
    }

    await prisma.question.delete({ where: { id } })
    revalidatePath('/dashboard/questions')
    return { success: "Question deleted" }
}

// ─── Toggle inExam flag on a question ───
export async function toggleQuestionInExam(id: string, inExam: boolean) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        return { error: "Unauthorized" }
    }
    await prisma.question.update({ where: { id }, data: { inExam } })
    revalidatePath('/dashboard/exam')
    return { success: true }
}

// ─── Update exam mode and questions-per-subtopic for a topic ───
const examSettingsSchema = z.object({
    topicId: z.string(),
    examMode: z.enum(["RANDOM", "FIXED"]),
    questionsPerSubtopic: z.number().int().min(1).max(20),
})

export async function updateExamSettings(values: z.infer<typeof examSettingsSchema>) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        return { error: "Unauthorized" }
    }
    const { topicId, examMode, questionsPerSubtopic } = examSettingsSchema.parse(values)
    await prisma.topic.update({
        where: { id: topicId },
        data: { examMode, questionsPerSubtopic }
    })
    revalidatePath('/dashboard/exam')
    return { success: true }
}
