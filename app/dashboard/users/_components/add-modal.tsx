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
import { useMutation, useQueryClient } from "@tanstack/react-query";


const schema = z.object({
  name:     z.string().min(1, 'Name is required'),
  email:    z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})
type UserForm = z.infer<typeof schema>
export function AddModal() {
  const [open, setOpen] = useState(false);
  const {register, handleSubmit, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: any) => {    
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Data added successfully!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });       
    },
  });
  const onsubmit = (data: UserForm) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-4">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> Add Users
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
              <Label htmlFor="name-1">Name</Label>
              <Input {...register('name')} className="w-full" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-1">Email</Label>
              <Input {...register('email')} className="w-full" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-1">Password</Label>
              <Input {...register('password')} className="w-full" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
