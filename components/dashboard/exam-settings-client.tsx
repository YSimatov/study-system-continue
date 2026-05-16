"use client"

import { useState, useTransition, useOptimistic } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { updateExamSettings, toggleQuestionInExam } from "@/app/actions/question-actions"
import { toast } from "sonner"
import { Shuffle, ListChecks, Save, HelpCircle } from "lucide-react"

interface Option {
    id: string
    text: string
    isCorrect: boolean
}

interface Question {
    id: string
    text: string
    inExam: boolean
    options: Option[]
}

interface Subtopic {
    id: string
    title: string
    questions: Question[]
}

interface Topic {
    id: string
    title: string
    slug: string
    examMode: "RANDOM" | "FIXED"
    questionsPerSubtopic: number
    subtopics: Subtopic[]
}

interface ExamSettingsClientProps {
    topics: Topic[]
}

function TopicExamCard({ topic }: { topic: Topic }) {
    const [isPending, startTransition] = useTransition()
    const [mode, setMode] = useState<"RANDOM" | "FIXED">(topic.examMode)
    const [limit, setLimit] = useState(topic.questionsPerSubtopic)
    const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(
        Object.fromEntries(
            topic.subtopics.flatMap(s => s.questions.map(q => [q.id, q.inExam]))
        )
    )

    const totalQs = topic.subtopics.reduce((acc, s) => acc + s.questions.length, 0)
    const markedCount = Object.values(checkedMap).filter(Boolean).length

    const saveSettings = () => {
        startTransition(async () => {
            const res = await updateExamSettings({
                topicId: topic.id,
                examMode: mode,
                questionsPerSubtopic: limit,
            })
            if (res?.error) toast.error(res.error)
            else toast.success("Настройки экзамена сохранены")
        })
    }

    const handleToggleQuestion = (qId: string, checked: boolean) => {
        setCheckedMap(prev => ({ ...prev, [qId]: checked }))
        startTransition(async () => {
            const res = await toggleQuestionInExam(qId, checked)
            if (res?.error) {
                toast.error(res.error)
                setCheckedMap(prev => ({ ...prev, [qId]: !checked })) // rollback
            }
        })
    }

    return (
        <Card className="border bg-card">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            {totalQs} вопросов в банке · {topic.subtopics.length} подтем
                        </CardDescription>
                    </div>
                    <Badge variant={mode === "FIXED" ? "default" : "secondary"} className="shrink-0 mt-0.5">
                        {mode === "FIXED" ? <><ListChecks className="h-3 w-3 mr-1" /> Фиксированный</> : <><Shuffle className="h-3 w-3 mr-1" /> Случайный</>}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* ── Mode toggle ── */}
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Случайный</span>
                    </div>
                    <Switch
                        checked={mode === "FIXED"}
                        onCheckedChange={(v) => setMode(v ? "FIXED" : "RANDOM")}
                        id={`mode-${topic.id}`}
                    />
                    <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Фиксированный</span>
                    </div>
                </div>

                {/* ── RANDOM: questions per subtopic ── */}
                {mode === "RANDOM" && (
                    <div className="flex items-center gap-3">
                        <Label htmlFor={`limit-${topic.id}`} className="text-sm whitespace-nowrap">
                            Вопросов на подтему:
                        </Label>
                        <Input
                            id={`limit-${topic.id}`}
                            type="number"
                            min={1}
                            max={20}
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            className="w-20 h-8"
                        />
                        <span className="text-xs text-muted-foreground">
                            Итого: ~{limit * topic.subtopics.length} вопросов
                        </span>
                    </div>
                )}

                {/* ── FIXED: question checklist ── */}
                {mode === "FIXED" && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Отмечено для экзамена:</span>
                            <Badge variant="outline">{markedCount} / {totalQs}</Badge>
                        </div>
                        <Accordion type="multiple" className="space-y-2">
                            {topic.subtopics.map(sub => (
                                <AccordionItem key={sub.id} value={sub.id} className="border rounded-lg px-0">
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            {sub.title}
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {sub.questions.filter(q => checkedMap[q.id]).length}/{sub.questions.length}
                                            </Badge>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-3">
                                        {sub.questions.length === 0 ? (
                                            <p className="text-xs text-muted-foreground italic">Вопросов нет</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {sub.questions.map(q => (
                                                    <div
                                                        key={q.id}
                                                        className={`flex items-start gap-3 p-2.5 rounded-md border transition-colors cursor-pointer
                                                            ${checkedMap[q.id]
                                                                ? "border-primary/40 bg-primary/5"
                                                                : "border-transparent bg-muted/30 hover:bg-muted/50"
                                                            }`}
                                                        onClick={() => handleToggleQuestion(q.id, !checkedMap[q.id])}
                                                    >
                                                        <Checkbox
                                                            id={q.id}
                                                            checked={!!checkedMap[q.id]}
                                                            onCheckedChange={(v) => handleToggleQuestion(q.id, !!v)}
                                                            onClick={e => e.stopPropagation()}
                                                            className="mt-0.5 shrink-0"
                                                        />
                                                        <Label
                                                            htmlFor={q.id}
                                                            className="text-sm font-normal cursor-pointer leading-snug flex-1"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            {q.text}
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                ({q.options.length} вар.)
                                                            </span>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}

                {/* ── Save button ── */}
                <div className="flex justify-end pt-1">
                    <Button size="sm" onClick={saveSettings} disabled={isPending}>
                        <Save className="h-3.5 w-3.5 mr-1.5" />
                        {isPending ? "Сохранение..." : "Сохранить настройки"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function ExamSettingsClient({ topics }: ExamSettingsClientProps) {
    if (topics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
                <HelpCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">Темы не найдены</p>
                <p className="text-sm text-muted-foreground mt-1">Создайте темы в разделе «Темы и Контент»</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {topics.map(topic => (
                <TopicExamCard key={topic.id} topic={topic} />
            ))}
        </div>
    )
}
