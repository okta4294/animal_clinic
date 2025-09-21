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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AnimalRecord } from "./add-table"
import { is } from "zod/v4/locales"

const schema = z.object({
  animal_id:            z.string().min(1, "Animal ID is required"),
  date_of_entry:        z.string().min(1, "Date of Entry is required"),
  common_name:          z.string().min(1, "Animal Name is required"),
  animal_type:          z.string().min(1, "Animal Type is required"),
  cage_number:          z.string().min(1, "Cage Number is required"),
  sex:                  z.string().min(1, "Sex is required"),
  reason_for_admission:  z.string().min(1, "Reason for Admission is required"),
  date_of_discharge:    z.string().optional(),
})

type AnimalEditForm = z.infer<typeof schema>

type EditModalProps = {
  animal: AnimalRecord
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function EditModal({ animal,isOpen, onOpenChange, onClose }: EditModalProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const defaultValues = {
    animal_id: animal.animal_id,
    date_of_entry:animal.date_of_entry, // bisa ambil dari field lain jika ada
    common_name: animal.common_name,
    animal_type: animal.animal_type,
    cage_number: animal.cage_number,
    sex: animal.sex,
    reason_for_admission: animal.reason_for_admission,
    date_of_discharge: animal.date_of_discharge ?? '',
  }

  const { register, handleSubmit, formState: { errors } } = useForm<AnimalEditForm>({
    resolver: zodResolver(schema),
    defaultValues,
  })

   const mutation = useMutation({
    mutationFn: async (data: AnimalEditForm) => {
      const bodyToSend = {
        ...data,
        date_of_discharge: data.date_of_discharge ? new Date(data.date_of_discharge) : null
      }

      const res = await fetch(`/api/animals/${data.animal_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      })
      if (!res.ok) throw new Error("Failed to update")
      return res.json()
    },
    onSuccess: (data) => {
      toast.success("Data updated successfully!")
      setOpen(false)
      onClose()
      queryClient.invalidateQueries({ queryKey: ["animals"] })
    },
  })

  const onsubmit = (data: AnimalEditForm) => {
    mutation.mutate(data)
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

        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label>Animal ID</Label>
              <Input {...register("animal_id")} />
            </div>

            <div className="grid gap-2">
              <Label>Data Of Entry</Label>
              <Input type="date" {...register("date_of_entry")} />
              {errors.date_of_entry && (<p className="text-red-500">{errors.date_of_entry.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Animal Name</Label>
              <Input {...register("common_name")} />
              {errors.common_name && (<p className="text-red-500">{errors.common_name.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Animal Type</Label>
              <Input {...register("animal_type")} />
              {errors.animal_type && (<p className="text-red-500">{errors.animal_type.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Cage Number</Label>
              <Input {...register("cage_number")} />
              {errors.cage_number && (<p className="text-red-500">{errors.cage_number.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Sex</Label>
              <Input {...register("sex")} />
              {errors.sex && (<p className="text-red-500">{errors.sex.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Reason for Admission</Label>
              <Input {...register("reason_for_admission")} />
              {errors.reason_for_admission && (<p className="text-red-500">{errors.reason_for_admission.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Date of Discharge</Label>
              <Input type="date" {...register("date_of_discharge")} />
              {errors.date_of_discharge && (<p className="text-red-500">{errors.date_of_discharge.message}</p>)}
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
