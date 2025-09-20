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

          {/* grid 3 kolom, otomatis wrap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" name="email" className="w-full" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-1">Password</Label>
              <Input id="password-1" name="password" className="w-full" />
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
