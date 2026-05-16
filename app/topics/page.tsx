import { SiteHeader } from "@/components/site-header"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TopicsPage() {
    const topics = await prisma.topic.findMany({
        orderBy: { createdAt: "asc" },
        include: {
            _count: {
                select: { subtopics: true }
            }
        }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Темы курса</h1>

                {topics.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Темы пока не добавлены. Загляните позже!
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topics.map((topic) => (
                            <Card key={topic.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{topic.title}</CardTitle>
                                    <CardDescription>{topic.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {topic._count.subtopics} Модулей
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/topics/${topic.slug}`}>
                                            <BookOpen className="mr-2 h-4 w-4" /> Начать обучение
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
