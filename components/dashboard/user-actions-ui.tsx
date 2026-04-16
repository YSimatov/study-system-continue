"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteUserAction, changeRoleAction } from "@/app/actions/user-actions"
import { Trash2, ShieldCheck } from "lucide-react"

type Role = "STUDENT" | "TEACHER" | "ADMIN"

const ROLE_LABELS: Record<Role, string> = {
    STUDENT: "Учащийся",
    TEACHER: "Преподаватель",
    ADMIN: "Администратор",
}

// ─── Delete user button ───────────────────────────────────────────────────────
export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
    const [isPending, startTransition] = useTransition()
    const [confirmed, setConfirmed] = useState(false)

    const handleClick = () => {
        if (!confirmed) {
            setConfirmed(true)
            setTimeout(() => setConfirmed(false), 3000)
            return
        }
        startTransition(async () => {
            const result = await deleteUserAction(userId)
            if (result?.error) toast.error(result.error)
            else toast.success(`Пользователь «${userName}» удалён`)
            setConfirmed(false)
        })
    }

    return (
        <Button
            variant={confirmed ? "destructive" : "ghost"}
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className="gap-1"
        >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmed ? "Подтвердить" : "Удалить"}
        </Button>
    )
}

// ─── Change role selector ─────────────────────────────────────────────────────
export function ChangeRoleSelect({
    userId,
    currentRole,
}: {
    userId: string
    currentRole: Role
}) {
    const [isPending, startTransition] = useTransition()
    const [role, setRole] = useState<Role>(currentRole)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role
        setRole(newRole)
        startTransition(async () => {
            const result = await changeRoleAction(userId, newRole)
            if (result?.error) {
                toast.error(result.error)
                setRole(currentRole) // revert
            } else {
                toast.success(`Роль изменена на «${ROLE_LABELS[newRole]}»`)
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <select
                value={role}
                onChange={handleChange}
                disabled={isPending}
                className="text-xs border rounded px-2 py-1 bg-background disabled:opacity-50 cursor-pointer"
            >
                <option value="STUDENT">Учащийся</option>
                <option value="TEACHER">Преподаватель</option>
                <option value="ADMIN">Администратор</option>
            </select>
        </div>
    )
}
