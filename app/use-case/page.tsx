import { SiteHeader } from "@/components/site-header"
import { UseCaseDiagram } from "@/components/use-case-diagram"

export const metadata = {
    title: "Use Case Диаграмма | InfoSys Learn",
    description: "Диаграмма прецедентов информационной системы InfoSys Learn — роли пользователей и их взаимодействие с системой.",
}

export default function UseCasePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Use Case диаграмма прецедентов
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Диаграмма описывает взаимодействие пользователей с информационной системой «InfoSys Learn» в соответствии с их ролями.
                    </p>
                </div>

                <UseCaseDiagram />

                {/* Legend */}
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-5 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">👤</span>
                            <h2 className="font-semibold text-lg">Учащийся</h2>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Регистрация и авторизация</li>
                            <li>Просмотр теоретического материала</li>
                            <li>Прохождение тестов самоконтроля</li>
                            <li>Прохождение экзамена по теме</li>
                            <li>Просмотр результатов в ЛК</li>
                        </ul>
                    </div>
                    <div className="border rounded-lg p-5 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">👨‍🏫</span>
                            <h2 className="font-semibold text-lg">Преподаватель</h2>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Все возможности учащегося</li>
                            <li>Управление темами и подтемами</li>
                            <li>Управление вопросами тестов</li>
                            <li>Просмотр успеваемости</li>
                        </ul>
                    </div>
                    <div className="border rounded-lg p-5 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">👑</span>
                            <h2 className="font-semibold text-lg">Администратор</h2>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Все возможности преподавателя</li>
                            <li>Управление пользователями</li>
                            <li>Назначение ролей</li>
                            <li>Полный доступ к системе</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
