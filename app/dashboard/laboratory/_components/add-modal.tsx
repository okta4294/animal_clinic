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

export function AddModal() {
  return (
    <Dialog>
      <form className="space-y-4">
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

          {/* grid 3 kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="pdf_file">Upload PDF</Label>
              <Input
                id="pdf_file"
                name="pdf_file"
                type="file"
                accept="application/pdf"
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_id">Animal ID</Label>
              <Input id="animal_id" name="animal_id" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="test_type">Test Type</Label>
              <Input id="test_type" name="test_type" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="test_date">Test Date</Label>
              <Input
                id="test_date"
                name="test_date"
                type="date"
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="drug_name">Drug Name</Label>
              <Input id="drug_name" name="drug_name" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input id="diagnosis" name="diagnosis" className="w-full" />
            </div>
            {/* Descriptions pakai textarea biasa */}
            <div className="grid gap-2 sm:col-span-2 md:col-span-3">
              <Label htmlFor="descriptions">Descriptions</Label>
              <textarea
                id="descriptions"
                name="descriptions"
                rows={3}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
