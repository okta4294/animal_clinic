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
              <Label htmlFor="animal_id-1">Animal ID</Label>
              <Input id="animal_id-1" name="animal_id" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date-1">Date</Label>
              <Input id="date-1" name="date" type="date" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight-1">Weight</Label>
              <Input id="weight-1" name="weight" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medicine-1">Medicine</Label>
              <Input id="medicine-1" name="medicine" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dosage-1">Dosage</Label>
              <Input id="dosage-1" name="dosage" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="food_given-1">Food Given</Label>
              <Input id="food_given-1" name="food_given" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance_foodtakeout-1">Balance Food Takeout</Label>
              <Input id="balance_foodtakeout-1" name="balance_foodtakeout" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dropping_consistency-1">Dropping Consistency</Label>
              <Input id="dropping_consistency-1" name="dropping_consistency" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="behaviour-1">Behaviour</Label>
              <Input id="behaviour-1" name="behaviour" className="w-full" />
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
