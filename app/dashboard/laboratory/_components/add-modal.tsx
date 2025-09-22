"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UploadButton } from "@/lib/src/utils/uploadthing"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// ---- Schema & Type ----
const schema = z.object({
  test_type: z.string().min(1, "Test Type is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  drug_name: z.string().min(1, "Drug Name is required"),
  test_date: z.string().min(1, "Test Date is required"),
  description: z.string().min(1, "Description is required"),
  animal_id: z.string().min(1, "Animal ID is required"),
  attachment_file: z.string().url("Upload PDF is required"),
})

type LabForm = z.infer<typeof schema>

// ---- Component ----
export function AddModal() {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  // --- React Hook Form ---
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LabForm>({
    resolver: zodResolver(schema),
  })

  // --- Fetch Animals ---
  const { data: animals = [] } = useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      const res = await fetch("/api/animals")
      const result = await res.json()
      return result?.data ?? []
    },
  })

  // --- Mutation untuk simpan data ---
  const [saving, setSaving] = useState(false);
  const mutation = useMutation({
  mutationFn: async (data: any) => {
    const res = await fetch("/api/laboratory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  onMutate: () => setSaving(true),
  onSettled: () => setSaving(false),
    onSuccess: () => {
      toast.success("Data berhasil disimpan!")
      queryClient.invalidateQueries({ queryKey: ["laboratory"] })
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(err.message || "Terjadi kesalahan")
    },
  })

  // --- Submit Handler ---
  const onSubmit = (data: LabForm) => {
  if (!data.attachment_file) {
    toast.error("File belum di-upload!")
    return
  }
  
  // Pastikan data dikirim dengan format yang benar
  const formData = {
    animal_id: data.animal_id,
    test_type: data.test_type,
    diagnosis: data.diagnosis,
    drug_name: data.drug_name,
    test_date: data.test_date,
    description: data.description,
    attachment_file: data.attachment_file, // URL dari UploadThing
  }
  
  mutation.mutate(formData)
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-4">
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add Data
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Add Test Record</DialogTitle>
          <DialogDescription>
            Upload file PDF dan isi data terkait hewan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
            {/* Upload PDF */}
            <div className="grid gap-2">
              <Label htmlFor="attachment_file">Upload PDF</Label>
              <UploadButton
              className="w-full border rounded-md px-3 py-2 text-black"
                  endpoint="pdfUploader"
                  onClientUploadComplete={(res) => {
                    setValue("attachment_file", res[0].url) // simpan URL ke form
                    toast.success("File berhasil di-upload")
                  }}
                  onUploadError={(err) => {
                    console.error(err)
                    toast.error("Upload gagal")
                  }}
                />
              {errors.attachment_file && (
                <span className="text-sm text-red-600">{errors.attachment_file.message}</span>
              )}
              </div>
            </div>

            {/* Animal ID */}
            <div className="grid gap-2">
              <Label htmlFor="animal_id">Animal ID</Label>
              <select
                id="animal_id"
                className="w-full border rounded-md px-3 py-2"
                {...register("animal_id")}
              >
                <option value="">-- Select Animal --</option>
                {animals.map((animal: any) => (
                  <option key={animal.id} value={animal.animal_id}>
                    {animal.animal_id} - {animal.common_name}
                  </option>
                ))}
              </select>
              {errors.animal_id && (
                <span className="text-sm text-red-600">{errors.animal_id.message}</span>
              )}
            </div>

            {/* Test Type */}
            <div className="grid gap-2">
              <Label htmlFor="test_type">Test Type</Label>
              <Input {...register("test_type")} className="w-full" />
              {errors.test_type && <span className="text-sm text-red-600">{errors.test_type.message}</span>}
            </div>

            {/* Test Date */}
            <div className="grid gap-2">
              <Label htmlFor="test_date">Test Date</Label>
              <Input type="date" {...register("test_date")} className="w-full" />
              {errors.test_date && <span className="text-sm text-red-600">{errors.test_date.message}</span>}
            </div>

            {/* Drug Name */}
            <div className="grid gap-2">
              <Label htmlFor="drug_name">Drug Name</Label>
              <Input {...register("drug_name")} className="w-full" />
              {errors.drug_name && <span className="text-sm text-red-600">{errors.drug_name.message}</span>}
            </div>

            {/* Diagnosis */}
            <div className="grid gap-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input {...register("diagnosis")} className="w-full" />
              {errors.diagnosis && <span className="text-sm text-red-600">{errors.diagnosis.message}</span>}
            </div>

            {/* Description */}
            <div className="grid gap-2 sm:col-span-2 md:col-span-3">
              <Label htmlFor="description">Description</Label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {errors.description && (
                <span className="text-sm text-red-600">{errors.description.message}</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </div>
    </Dialog>
  )
}
