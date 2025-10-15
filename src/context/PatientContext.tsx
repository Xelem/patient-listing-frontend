import type { Patient } from 'fhir/r4'
import { createContext } from 'react'

export interface PatientContextType {
    patients: Patient[]
    addPatient: (patient: Patient) => void
    updatePatient: (patient: Patient) => void
    deletePatient: (id: string) => void
}

export const PatientContext = createContext<PatientContextType | undefined>(
    undefined,
)
