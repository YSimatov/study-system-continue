"use server"

import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// ─── Any user can delete their own account ───────────────────────────────────
export async function deleteMyAccountAction() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Не авторизован" }

    await prisma.user.delete({ where: { id: session.user.id } })

    await signOut({ redirect: false })
    redirect("/")
}

// ─── Admin: delete a user (cannot delete another ADMIN) ──────────────────────
export async function deleteUserAction(targetUserId: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Нет прав" }
    if (session.user.id === targetUserId) return { error: "Нельзя удалить себя через эту функцию" }

    const target = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!target) return { error: "Пользователь не найден" }
    if (target.role === "ADMIN") return { error: "Нельзя удалить администратора" }

    await prisma.user.delete({ where: { id: targetUserId } })

    revalidatePath("/dashboard/users")
    return { success: true }
}

// ─── Admin: change user role (cannot touch another ADMIN) ────────────────────
const roleSchema = z.enum(["STUDENT", "TEACHER", "ADMIN"])

export async function changeRoleAction(targetUserId: string, newRole: string) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return { error: "Нет прав" }
    if (session.user.id === targetUserId) return { error: "Нельзя изменить свою роль через эту форму" }

    const parsed = roleSchema.safeParse(newRole)
    if (!parsed.success) return { error: "Недопустимая роль" }

    const target = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!target) return { error: "Пользователь не найден" }
    if (target.role === "ADMIN") return { error: "Нельзя изменить роль другого администратора" }

    await prisma.user.update({
        where: { id: targetUserId },
        data: { role: parsed.data }
    })

    revalidatePath("/dashboard/users")
    return { success: true }
}
