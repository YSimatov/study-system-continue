import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteUserButton, ChangeRoleSelect } from "@/components/dashboard/user-actions-ui"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Администратор",
    TEACHER: "Преподаватель",
    STUDENT: "Учащийся",
}

export default async function UsersPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "TEACHER") {
        redirect("/dashboard")
    }

    const isAdmin = session.user.role === "ADMIN"

    const users = await prisma.user.findMany({
        where: session.user.role === "TEACHER"
            ? { role: { in: ["STUDENT", "TEACHER"] } }
            : {},
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { attempts: true } } }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Пользователи</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Список пользователей ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Имя</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Роль</TableHead>
                                <TableHead>Попыток</TableHead>
                                <TableHead>Регистрация</TableHead>
                                <TableHead>Профиль</TableHead>
                                {isAdmin && <TableHead>Изменить роль</TableHead>}
                                {isAdmin && <TableHead className="text-right">Удаление</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => {
                                const isCurrentUser = user.id === session.user.id
                                const isOtherAdmin = user.role === "ADMIN" && !isCurrentUser

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name || "Без имени"}
                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs text-muted-foreground">(вы)</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.role === "ADMIN" ? "destructive"
                                                : user.role === "TEACHER" ? "default"
                                                : "secondary"
                                            }>
                                                {ROLE_LABELS[user.role]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user._count.attempts}</TableCell>
                                        <TableCell>
                                            {user.createdAt.toLocaleDateString("ru-RU")}
                                        </TableCell>

                                        {/* Profile link — always visible */}
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/dashboard/users/${user.id}`}>
                                                    Просмотр профиля →
                                                </Link>
                                            </Button>
                                        </TableCell>

                                        {/* Change role — admin only, not for other admins */}
                                        {isAdmin && (
                                            <TableCell>
                                                {!isOtherAdmin && !isCurrentUser ? (
                                                    <ChangeRoleSelect
                                                        userId={user.id}
                                                        currentRole={user.role as "STUDENT" | "TEACHER" | "ADMIN"}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                        )}

                                        {/* Delete — admin only, not for other admins */}
                                        {isAdmin && (
                                            <TableCell className="text-right">
                                                {!isOtherAdmin && !isCurrentUser ? (
                                                    <DeleteUserButton
                                                        userId={user.id}
                                                        userName={user.name || user.email}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
