import { useState, type ReactNode } from 'react'
import { PatientContext } from './PatientContext'
import type { Patient } from 'fhir/r4'

interface PatientProviderProps {
    children: ReactNode
}

export const PatientProvider = ({ children }: PatientProviderProps) => {
    const [patients, setPatients] = useState<Patient[]>([])

    const addPatient = (patient: Patient) => {
        setPatients(prev => {
            // Check if patient with the same id already exists
            if (prev.some(p => p.id === patient.id)) {
                return prev // Skip adding if duplicate
            }
            return [...prev, patient]
        })
    }

    const updatePatient = (updated: Patient) =>
        setPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)))

    const deletePatient = (id: string) =>
        setPatients(prev => prev.filter(p => p.id !== id))

    return (
        <PatientContext.Provider
            value={{ patients, addPatient, updatePatient, deletePatient }}
        >
            {children}
        </PatientContext.Provider>
    )
}
