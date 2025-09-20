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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import cluster from "cluster"
import { toast, Toaster } from "sonner"
import { useState } from "react"

const schema = z.object({
  animal_id:            z.string().min(1, 'Animal ID is required'),
  date_of_entry:        z.string().min(1, 'Date of Entry is required'),
  animal_name:          z.string().min(1, 'Animal Name is required'),
  animal_type:          z.string().min(1, 'Animal Type is required'),
  cage_number:          z.string().min(1, 'Cage Number is required'),
  sex:                  z.string().min(1, 'Sex is required'),
  reason_of_admission:  z.string().min(1, 'Reason of Admission is required'),
})

type AnimalForm = z.infer<typeof schema>
export function AddModal() {
  const [open, setOpen] = useState(false);
  const {register, handleSubmit, formState: { errors } } = useForm<AnimalForm>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/animals", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Data added successfully!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["animals"] });
    },
  });
  const onsubmit = (data: AnimalForm) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-4">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> Add Data
          </Button>
        </DialogTrigger>

        {/* dialog besar */}
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle>Edit Data</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* grid 3 kolom, otomatis wrap */}
          <form
      className="space-y-4"
      onSubmit={handleSubmit(onsubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="animal_id-1">Animal Id</Label>
              <Input {...register("animal_id")} className="w-full" />
            {errors.animal_id && <span className="text-sm text-red-600">{errors.animal_id.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_entry-1">Date of Entry</Label>
              <Input {...register("date_of_entry")} type="date" className="w-full" />
            {errors.date_of_entry && <span className="text-sm text-red-600">{errors.date_of_entry.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_name-1">Animal Name</Label>
              <Input {...register("animal_name")} className="w-full" />
            {errors.animal_name && <span className="text-sm text-red-600">{errors.animal_name.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_type-1">Animal Type</Label>
              <Input {...register("animal_type")} className="w-full" />
            {errors.animal_type && <span className="text-sm text-red-600">{errors.animal_type.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cage_number-1">Cage Number</Label>
              <Input {...register("cage_number")} className="w-full" />
            {errors.cage_number && <span className="text-sm text-red-600">{errors.cage_number.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sex-1">Sex</Label>
              <Input {...register("sex")} className="w-full" />
            {errors.sex && <span className="text-sm text-red-600">{errors.sex.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason_for_admission-1">Reason for Admission</Label>
              <Input {...register("reason_of_admission")} className="w-full" />
            {errors.reason_of_admission && <span className="text-sm text-red-600">{errors.reason_of_admission.message}</span>}
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
     </div>
    </Dialog>
  )
}
