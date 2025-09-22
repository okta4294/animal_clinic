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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import cluster from "cluster"
import { toast, Toaster } from "sonner"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { inspect } from "util"
import React from "react";


const schema = z.object({
  animal_id:            z.string().min(1, 'Animal ID is required'),
  inspection_date:      z.string().min(1, 'Inspection Date is required'),
  animal_weight:        z.number().min(0, 'Animal Weight is required'),
  drug_name:            z.string().min(1, 'Drug Name is required'),
  dosage:               z.string().min(1, 'Dosage is required'),
  food_given:           z.string().min(1, 'Food Given is required'),
  balance_food_take_out:z.string().min(1, 'Balance Food Take Out is required'),
  dopping_consistency:  z.string().min(1, 'Dopping Consistency is required'),
  animal_behavior:      z.string().min(1, 'Animal Behavior is required'),
  userId:               z.string().min(1, 'User ID is required'),
})

type DailyForm = z.infer<typeof schema>
export function AddModal() {
  const[open, setOpen] = useState(false);
   // ambil user dari localStorage sekali saja
  const currentUser = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  }, []);
  const { data: animals = [] } = useQuery({
    queryKey: ["animals"], 
    queryFn: async () => {
      const res = await fetch("/api/animals")
      const result = await res.json()
      return result?.data ?? []
    }
  })
  const {register, handleSubmit, formState: { errors } } = useForm<DailyForm>({
    resolver: zodResolver(schema),
     defaultValues: {
      // default userId otomatis dari user login
      userId: currentUser?.id ?? '',
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/dailyinspection", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Data added successfully!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dailyinspection"] });
    },
  });
  const onsubmit = (data: DailyForm) => {
    console.log(data);
    mutation.mutate(data);
    const payload = { ...data, userId: currentUser?.id };
    mutation.mutate(payload);
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
        <form className="space-y-4"
        onSubmit={handleSubmit(onsubmit)}>
          {/* grid 3 kolom, otomatis wrap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="animal_id-1">Animal ID</Label>
              <select
                  id="animal_id"
                  className="w-full border rounded-md px-3 py-2"
                  {...register("animal_id")}  // ini supaya react-hook-form tau value-nya
                >
                  <option value="">-- Select Animal --</option>
                  {animals.map((animal: any) => (
                    <option key={animal.id} value={animal.animal_id}>
                      {animal.animal_id} - {animal.common_name}
                    </option>
                  ))}
                </select>
                {errors.animal_id && <span className="text-sm text-red-600">{errors.animal_id.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inspection_date">Date</Label>
              <Input {...register("inspection_date")} type="date" className="w-full" />
              {errors.inspection_date && <span className="text-sm text-red-600">{errors.inspection_date.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_weight">Weight</Label>
              <Input {...register("animal_weight", { valueAsNumber: true })} type="number" step="any" className="w-full" />
              {errors.animal_weight && <span className="text-sm text-red-600">{errors.animal_weight.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="drug_name">Medicine</Label>
              <Input {...register("drug_name")} className="w-full" />
              {errors.drug_name && <span className="text-sm text-red-600">{errors.drug_name.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input {...register("dosage")} className="w-full" />
              {errors.dosage && <span className="text-sm text-red-600">{errors.dosage.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="food_given">Food Given</Label>
              <Input {...register("food_given")} className="w-full" />
              {errors.food_given && <span className="text-sm text-red-600">{errors.food_given.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance_food_take_out">Balance Food Takeout</Label>
              <Input {...register("balance_food_take_out")} className="w-full" />
              {errors.balance_food_take_out && <span className="text-sm text-red-600">{errors.balance_food_take_out.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dopping_consistency">Dropping Consistency</Label>
              <Input {...register("dopping_consistency")} className="w-full" />
              {errors.dopping_consistency && <span className="text-sm text-red-600">{errors.dopping_consistency.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_behavior">Behaviour</Label>
              <Input {...register("animal_behavior")} className="w-full" />
              {errors.animal_behavior && <span className="text-sm text-red-600">{errors.animal_behavior.message}</span>}
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
