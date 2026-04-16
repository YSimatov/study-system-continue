"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { submitExam } from "@/app/actions/exam-actions"
import { toast } from "sonner"

interface Question {
    id: string
    text: string
    subtopicTitle: string
    options: { id: string; text: string }[]
}

interface ExamFormProps {
    topicId: string
    topicTitle: string
    questions: Question[]
}

export function ExamForm({ topicId, topicTitle, questions }: ExamFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [answers, setAnswers] = useState<Record<string, string>>({})

    const answeredCount = Object.keys(answers).length
    const progress = Math.round((answeredCount / questions.length) * 100)

    const handleSubmit = () => {
        if (answeredCount < questions.length) {
            toast.error(`Ответьте на все вопросы. Осталось: ${questions.length - answeredCount}`)
            return
        }

        const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
            questionId: qId,
            optionId: oId,
        }))

        startTransition(async () => {
            const result = await submitExam({ topicId, answers: formattedAnswers })
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success) {
                const pct = Math.round((result.score / result.total) * 100)
                toast.success(`Экзамен сдан! Результат: ${result.score} / ${result.total} (${pct}%)`, {
                    duration: 5000,
                })
                router.push("/dashboard")
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Progress bar */}
            <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b py-3 -mx-4 px-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Прогресс: {answeredCount} из {questions.length}</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Questions — no color highlighting anywhere */}
            <div className="space-y-6 pt-2">
                {questions.map((q, index) => (
                    <Card key={q.id} className={answers[q.id] ? "border-border" : "border-border"}>
                        <CardHeader className="pb-3">
                            <div className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                                {q.subtopicTitle}
                            </div>
                            <CardTitle className="text-base font-semibold leading-snug">
                                {index + 1}. {q.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                onValueChange={(val) =>
                                    setAnswers(prev => ({ ...prev, [q.id]: val }))
                                }
                                value={answers[q.id] ?? ""}
                            >
                                <div className="space-y-2">
                                    {q.options.map((opt) => (
                                        <div
                                            key={opt.id}
                                            className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <RadioGroupItem value={opt.id} id={opt.id} />
                                            <Label
                                                htmlFor={opt.id}
                                                className="cursor-pointer font-normal leading-normal flex-1"
                                            >
                                                {opt.text}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-4 pb-16">
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="px-10"
                >
                    {isPending ? "Отправка..." : "Завершить экзамен"}
                </Button>
            </div>
        </div>
    )
}
