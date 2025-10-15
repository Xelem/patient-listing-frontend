// src/lib/fhir.ts
import axios from 'axios'
import type { Patient, Bundle, OperationOutcome, Resource } from 'fhir/r4'

const FHIR_BASE_URL =
    import.meta.env.VITE_FHIR_BASE_URL || 'http://localhost:3001/fhir'

// Type definitions
export interface FhirResponse<T extends Resource> {
    data: T | Bundle<T> | OperationOutcome
}

const PatientService = {
    async listPatients(name?: string): Promise<Patient[]> {
        const url = name
            ? `${FHIR_BASE_URL}/Patient?name=${encodeURIComponent(
                  name,
              )}_tag=http://tmf.health/apps|patient-listing-app`
            : `${FHIR_BASE_URL}/Patient?_tag=patient-listing-app`

        const response = await axios.get<FhirResponse<Patient>>(url)
        const bundle = response.data as unknown as Bundle<Patient>

        if (!bundle.entry) return []
        return bundle.entry.map(entry => entry.resource as Patient)
    },

    async getPatient(id: string): Promise<Patient> {
        const response = await axios.get<FhirResponse<Patient>>(
            `${FHIR_BASE_URL}/Patient/${id}?_tag=http://tmf.health/apps|patient-listing-app`,
        )
        return response.data as unknown as Patient
    },

    async createPatient(patient: Patient): Promise<Patient> {
        const response = await axios.post<FhirResponse<Patient>>(
            `${FHIR_BASE_URL}/Patient`,
            patient,
            { headers: { 'Content-Type': 'application/fhir+json' } },
        )
        console.log(response.data)
        return response.data as unknown as Patient
    },

    async updatePatient(patient: Patient): Promise<Patient> {
        if (!patient.id) throw new Error('Patient ID is required for update')

        const response = await axios.put<FhirResponse<Patient>>(
            `${FHIR_BASE_URL}/Patient/${patient.id}`,
            patient,
            { headers: { 'Content-Type': 'application/fhir+json' } },
        )
        return response.data as unknown as Patient
    },

    async deletePatient(id: string): Promise<void> {
        await axios.delete(`${FHIR_BASE_URL}/Patient/${id}`)
    },
}

export default PatientService
