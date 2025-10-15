import { Button } from './ui/button'
import { IoLogoBuffer } from 'react-icons/io5'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import PatientForm from './PatientForm'
import type { Patient } from 'fhir/r4'
import { useState } from 'react'

export default function Navbar() {
    const [selected, setSelected] = useState<Patient | null>(null)
    const [open, setOpen] = useState(false)

    const handleSaved = () => {
        setSelected(null)
        setOpen(false)
    }

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex">
                    <IoLogoBuffer className="text-3xl text-blue-600 mr-2" />
                    <h1 className="text-lg font-bold text-gray-800">
                        Patient Manager
                    </h1>
                </div>
                <div className="space-x-3">
                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:cursor-pointer"
                                    onClick={() => setSelected(null)}
                                >
                                    Add Patient
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90vw] md:w-[70vw] max-w-none max-h-[90%] overflow-y-auto scrollbar-hide">
                                <DialogHeader>
                                    <DialogTitle>
                                        {selected
                                            ? 'Edit Patient'
                                            : 'Add Patient'}
                                    </DialogTitle>
                                </DialogHeader>
                                <PatientForm
                                    selected={selected}
                                    onSaved={handleSaved}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </nav>
    )
}
