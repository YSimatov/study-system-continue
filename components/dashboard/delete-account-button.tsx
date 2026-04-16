"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteMyAccountAction } from "@/app/actions/user-actions"
import { Trash2 } from "lucide-react"

export function DeleteMyAccountButton() {
    const [isPending, startTransition] = useTransition()
    const [step, setStep] = useState<"idle" | "confirm">("idle")

    const handleClick = () => {
        if (step === "idle") {
            setStep("confirm")
            setTimeout(() => setStep("idle"), 4000)
            return
        }
        startTransition(async () => {
            toast.loading("Удаляем аккаунт...")
            await deleteMyAccountAction()
        })
    }

    return (
        <Button
            variant={step === "confirm" ? "destructive" : "outline"}
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className="gap-2"
        >
            <Trash2 className="h-4 w-4" />
            {step === "confirm" ? "Нажмите ещё раз для подтверждения" : "Удалить мой аккаунт"}
        </Button>
    )
}
