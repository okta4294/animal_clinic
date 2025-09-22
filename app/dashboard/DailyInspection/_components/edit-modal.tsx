"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { DailyRecord } from "./add-table"

const schema = z.object({
  animal_id:        z.string().min(1, "Animal ID is required"),
  inspection_date:  z.string().min(1, "Inspection Date is required"),
  animal_weight:    z.number().min(0, "Animal Weight is required"),
  drug_name:        z.string().min(1, "Drug Name is required"),
  dosage:           z.string().min(1, "Dosage is required"),
  food_given:       z.string().min(1, "Food Given is required"),
  balance_food_take_out: z.string().min(1, "Balance Food Take Out is required"),
  dopping_consistency:   z.string().min(1, "Dopping Consistency is required"),
  animal_behavior:       z.string().min(1, "Animal Behavior is required"),
  userId:               z.string().min(1, "User ID is required"),
})

type DailyEditForm = z.infer<typeof schema>

type EditModalProps = {
  Daily: DailyRecord
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function EditModal({ Daily, isOpen, onOpenChange, onClose }: EditModalProps) {
  const queryClient = useQueryClient()

  // ambil user login dari localStorage
  const currentUser = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user")
      return raw ? JSON.parse(raw) : null
    }
    return null
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<DailyEditForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      animal_id:        Daily.animal_id,
      inspection_date:  Daily.inspection_date?.split("T")[0], // untuk input type=date
      animal_weight:    Daily.animal_weight,
      drug_name:        Daily.drug_name,
      dosage:           Daily.dosage,
      food_given:       Daily.food_given,
      balance_food_take_out: Daily.balance_food_take_out,
      dopping_consistency:   Daily.dopping_consistency,
      animal_behavior:       Daily.animal_behavior,
      userId: currentUser?.id ?? "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: DailyEditForm) => {
      // kirim PUT ke /api/dailyinspection/[animal_id]
      const res = await fetch(`/api/dailyinspection/${Daily.animal_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Data updated successfully!")
      onClose()
      queryClient.invalidateQueries({ queryKey: ["dailyinspection"] })
    },
  })

  const onSubmit = (data: DailyEditForm) => {
    const payload = { ...data, userId: currentUser?.id } // userId selalu user login
    mutation.mutate(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Edit Data</DialogTitle>
          <DialogDescription>
            Update the animal inspection data. Click save when done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label>Animal ID</Label>
              <Input {...register("animal_id")} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" {...register("inspection_date")} />
              {errors.inspection_date && <p className="text-red-500">{errors.inspection_date.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Weight</Label>
              <Input type="number" step="any" {...register("animal_weight", { valueAsNumber: true })} />
              {errors.animal_weight && <p className="text-red-500">{errors.animal_weight.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Medicine</Label>
              <Input {...register("drug_name")} />
              {errors.drug_name && <p className="text-red-500">{errors.drug_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Dosage</Label>
              <Input {...register("dosage")} />
              {errors.dosage && <p className="text-red-500">{errors.dosage.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Food Given</Label>
              <Input {...register("food_given")} />
              {errors.food_given && <p className="text-red-500">{errors.food_given.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Balance Food Takeout</Label>
              <Input {...register("balance_food_take_out")} />
              {errors.balance_food_take_out && <p className="text-red-500">{errors.balance_food_take_out.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Dopping Consistency</Label>
              <Input {...register("dopping_consistency")} />
              {errors.dopping_consistency && <p className="text-red-500">{errors.dopping_consistency.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Behaviour</Label>
              <Input {...register("animal_behavior")} />
              {errors.animal_behavior && <p className="text-red-500">{errors.animal_behavior.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
