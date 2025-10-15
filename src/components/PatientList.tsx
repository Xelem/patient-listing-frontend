import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import PatientService from '../services/fhir'
import { usePatients } from '../context/usePatients'
import type { Patient } from 'fhir/r4'
import PatientForm from './PatientForm'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog'
import { User } from 'lucide-react'

export default function PatientList() {
    const { patients, addPatient, deletePatient } = usePatients()
    const [selected, setSelected] = useState<Patient | null>(null)
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const load = async () => {
        const data = await PatientService.listPatients()
        data.forEach((p: Patient) => addPatient(p))
    }

    useEffect(() => {
        if (patients.length === 0) load()
    }, [])

    const handleDelete = async (id?: string) => {
        if (!id) return
        await PatientService.deletePatient(id)
        deletePatient(id)
    }

    const filtered = patients.filter(p => {
        const name = p.name?.[0]
        const family = name?.family?.toLowerCase() || ''
        const given = name?.given?.join(' ').toLowerCase() || ''
        return (
            family.includes(search.toLowerCase()) ||
            given.includes(search.toLowerCase())
        )
    })

    return (
        <div className="px-6 max-w-[95%] mx-auto mb-0">
            <Card className="mt-0">
                <CardContent>
                    <div className="mt-4 mb-4">
                        <p className="text-lg font-semibold text-gray-700">
                            Total Patients: {patients.length}
                        </p>
                    </div>
                    <Input
                        placeholder="Search patient..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mt-4 mb-4"
                    />

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Birth Date</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(p => {
                                    const name = p.name?.[0]
                                    const fullName = `${
                                        name?.given?.join(' ') || ''
                                    } ${name?.family || ''}`
                                    const phone =
                                        p.telecom?.find(
                                            t => t.system === 'phone',
                                        )?.value || '—'
                                    const photoUrl = p.photo?.[0]?.url

                                    return (
                                        <TableRow key={p.id}>
                                            <TableCell>
                                                {photoUrl ? (
                                                    <img
                                                        src={photoUrl}
                                                        alt="Patient"
                                                        className="w-10 h-10 rounded-full object-cover border"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border">
                                                        <User className="text-gray-500 w-5 h-5" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{fullName}</TableCell>
                                            <TableCell>{p.gender}</TableCell>
                                            <TableCell>
                                                {p.birthDate || '—'}
                                            </TableCell>
                                            <TableCell>{phone}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:shadow-lg hover:cursor-pointer"
                                                    onClick={() => {
                                                        setSelected(p)
                                                        setIsOpen(true)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="hover:shadow-lg hover:cursor-pointer"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Patient
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. Are you
                                                                sure you want to
                                                                delete this
                                                                patient’s
                                                                record?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700 hover:shadow-lg hover:cursor-pointer"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        p.id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[90vw] md:w-[70vw] max-w-none max-h-[90%] overflow-y-auto scrollbar-hide">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? 'Edit Patient' : 'Add Patient'}
                        </DialogTitle>
                    </DialogHeader>
                    <PatientForm
                        selected={selected}
                        onSaved={() => {
                            setIsOpen(false)
                            setSelected(null)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
