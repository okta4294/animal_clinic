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

        {/* dialog besar */}
        <DialogContent className="max-w-screen-xl">
          <DialogHeader>
            <DialogTitle>Edit Data</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* grid 3 kolom, otomatis wrap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="animal_id-1">Animal Id</Label>
              <Input id="animal_id-1" name="animal_id" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_entry-1">Date of Entry</Label>
              <Input id="date_of_entry-1" name="date_of_entry" type="date" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_name-1">Animal Name</Label>
              <Input id="animal_name-1" name="animal_name" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="animal_type-1">Animal Type</Label>
              <Input id="animal_type-1" name="animal_type" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cage_number-1">Cage Number</Label>
              <Input id="cage_number-1" name="cage_number" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sex-1">Sex</Label>
              <Input id="sex-1" name="sex" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason_for_admission-1">Reason for Admission</Label>
              <Input id="reason_for_admission-1" name="reason_for_admission" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_discharge-1">Date of Discharge</Label>
              <Input id="date_of_discharge-1" name="date_of_discharge" type="date" className="w-full" />
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
