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
import { LabRecord } from "./add-table"
import { UploadButton } from "@/lib/src/utils/uploadthing"

// Perbaiki schema - attachment_file harus string (URL)
const schema = z.object({
  animal_id: z.string().min(1, "Animal ID is required"),
  test_date: z.string().min(1, "Test Date is required"),
  test_type: z.string().min(1, "Test Type is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  attachment_file: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  drug_name: z.string().min(1, "Drug Name is required"),
})

type LabEditForm = z.infer<typeof schema>

type EditModalProps = {
  Lab: LabRecord & { file_key?: string } // Tambahkan file_key
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function EditModal({ Lab, isOpen, onOpenChange, onClose }: EditModalProps) {
  const queryClient = useQueryClient()
  const [currentFileUrl, setCurrentFileUrl] = useState(Lab.attachment_file || "")

  const defaultValues = {
    animal_id: Lab.animal_id,
    test_date: Lab.test_date.split('T')[0], // Format date untuk input type="date"
    test_type: Lab.test_type,
    diagnosis: Lab.diagnosis,
    attachment_file: Lab.attachment_file || '',
    description: Lab.description,
    drug_name: Lab.drug_name,
  }

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LabEditForm>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: async (data: LabEditForm) => {
      // Pastikan data test_date dalam format yang benar
      const formattedData = {
        ...data,
        test_date: new Date(data.test_date).toISOString(),
      }
      
      const res = await fetch(`/api/laboratory/${Lab.id}`, { // Gunakan ID record, bukan animal_id
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      })
      if (!res.ok) throw new Error("Failed to update")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Data updated successfully!")
      onClose()
      queryClient.invalidateQueries({ queryKey: ["laboratory"] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update data")
    },
  })

  const onSubmit = (data: LabEditForm) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>Edit Data</DialogTitle>
          <DialogDescription>
            Update the animal inspection data. Click save when done (If you want to replace a file, first delete the data you want to change.).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="attachment_file">Attachment File</Label>
              <UploadButton
                className="w-full border ut-button:border-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                endpoint="pdfUploader"
                onClientUploadComplete={(files) => {
                  const fileUrl = files[0].url;
                  setValue("attachment_file", fileUrl);
                  setCurrentFileUrl(fileUrl);
                  toast.success("File berhasil di-upload!");
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
                disabled
              />
              {currentFileUrl && (
                <div className="mt-2 text-sm text-green-600">
                  File terupload: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="underline">Lihat file</a>
                </div>
              )}
              {errors.attachment_file && (
                <p className="text-red-500 text-sm">{errors.attachment_file.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Animal ID</Label>
              <Input {...register("animal_id")} disabled />
            </div>
            
            <div className="grid gap-2">
              <Label>Test Date</Label>
              <Input type="date" {...register("test_date")} />
              {errors.test_date && (<p className="text-red-500 text-sm">{errors.test_date.message}</p>)}
            </div>
            
            <div className="grid gap-2">
              <Label>Test Type</Label>
              <Input {...register("test_type")} />
              {errors.test_type && (<p className="text-red-500 text-sm">{errors.test_type.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Drug Name</Label>
              <Input {...register("drug_name")} />
              {errors.drug_name && (<p className="text-red-500 text-sm">{errors.drug_name.message}</p>)}
            </div>

            <div className="grid gap-2">
              <Label>Diagnosis</Label>
              <Input {...register("diagnosis")} />
              {errors.diagnosis && (<p className="text-red-500 text-sm">{errors.diagnosis.message}</p>)}
            </div>

            <div className="grid gap-2 md:col-span-3">
              <Label>Description</Label>
              <textarea
                {...register("description")}
                className="w-full border rounded-md px-3 py-2 min-h-[100px]"
              />
              {errors.description && (<p className="text-red-500 text-sm">{errors.description.message}</p>)}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}