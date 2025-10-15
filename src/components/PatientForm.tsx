import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import PatientService from '../services/fhir'
import type { ContactPoint, Patient } from 'fhir/r4'
import { usePatients } from '../context/usePatients'
import { Textarea } from './ui/textarea'
import axios from 'axios'
import { User } from 'lucide-react'
import GenderSelect from './GenderSelect'

interface Props {
    selected: Patient | null
    onSaved: () => void
}

export default function PatientForm({ selected, onSaved }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [given, setGiven] = useState('')
    const [family, setFamily] = useState('')
    const [gender, setGender] = useState<
        'male' | 'female' | 'other' | 'unknown' | 'undefined'
    >('undefined')
    const [birthDate, setBirthDate] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)

    const { addPatient, updatePatient } = usePatients()

    useEffect(() => {
        if (selected) {
            setGiven(selected.name?.[0]?.given?.join(' ') || '')
            setFamily(selected.name?.[0]?.family || '')
            setGender(
                (selected.gender as
                    | 'male'
                    | 'female'
                    | 'other'
                    | 'unknown'
                    | 'undefined') || 'undefined',
            )
            setBirthDate(selected.birthDate || '')
            setPhone(
                selected.telecom?.find(t => t.system === 'phone')?.value || '',
            )
            setEmail(
                selected.telecom?.find(t => t.system === 'email')?.value || '',
            )
            setAddress(selected.address?.[0]?.text || '')
            setPhotoPreview(selected.photo?.[0]?.url || null)
        } else {
            setGiven('')
            setFamily('')
            setGender('undefined')
            setBirthDate('')
            setPhone('')
            setEmail('')
            setAddress('')
            setPhoto(null)
            setPhotoPreview(null)
        }
    }, [selected])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhoto(file)
            const reader = new FileReader()
            reader.onloadend = () => setPhotoPreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)

        if (gender === 'undefined') {
            alert('Please select a gender')
            setIsSubmitting(false)
            return
        }

        const patient: Patient = {
            resourceType: 'Patient',
            meta: {
                tag: [
                    {
                        system: 'http://tmf.health/apps',
                        code: 'patient-listing-app',
                        display: 'Patient Listing App',
                    },
                ],
            },
            name: [{ given: given.split(' '), family }],
            gender,
            birthDate,
            telecom: [
                ...(phone ? [{ system: 'phone', value: phone }] : []),
                ...(email ? [{ system: 'email', value: email }] : []),
            ] as ContactPoint[],
            address: address ? [{ text: address }] : undefined,
            photo: photoUrl
                ? [
                      {
                          contentType: 'image/jpeg',
                          url: photoUrl, // Cloudinary-hosted URL
                      },
                  ]
                : undefined,
        }

        try {
            if (selected?.id) {
                const updated = await PatientService.updatePatient({
                    ...patient,
                    id: selected.id,
                })
                updatePatient(updated)
            } else {
                const created = await PatientService.createPatient(patient)
                addPatient(created)
            }

            onSaved()
        } catch (error) {
            console.error('Failed to save patient:', error)
            alert('Failed to save patient. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpload = async () => {
        if (!photo) {
            setUploadError('Please select an image before uploading.')
            return
        }

        setUploading(true)
        setUploadError(null)
        setUploadSuccess(false)

        try {
            const formData = new FormData()
            formData.append('file', photo)
            formData.append('upload_preset', 'unsigned_preset')

            const uploadRes = await axios.post(
                'https://api.cloudinary.com/v1_1/dfvbzldhu/image/upload',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            )

            setPhotoUrl(uploadRes.data.secure_url)
            setUploadSuccess(true)
            console.log('Uploaded:', uploadRes.data)
        } catch (err: any) {
            console.error('Upload failed:', err)
            setUploadError(
                err?.response?.data?.error?.message || 'Image upload failed.',
            )
        } finally {
            setUploading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
        >
            <div className="md:col-span-2 flex flex-col items-center mt-4">
                <div className="relative">
                    <label className="block text-sm font-large font-bold text-center mb-2">
                        Photo
                    </label>

                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden relative hover:border-gray-600 transition">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Preview"
                                className="object-cover w-full h-full"
                            />
                        ) : selected?.photo?.[0]?.url ? (
                            <img
                                src={selected.photo[0].url}
                                alt="Existing"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border">
                                <User className="text-gray-500 w-5 h-5" />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!photo || uploading}
                    className="mt-3"
                >
                    {uploading
                        ? 'Uploading...'
                        : selected?.photo?.[0]?.url || photoPreview
                        ? 'Change Image'
                        : 'Upload Image'}
                </Button>

                {uploadSuccess && (
                    <p className="text-green-600 text-sm mt-2">
                        Upload successful!
                    </p>
                )}
                {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
            </div>

            <div>
                <Label className="mb-1">Given Name</Label>
                <Input
                    value={given}
                    onChange={e => setGiven(e.target.value)}
                    placeholder="John"
                    required
                    className="focus-visible:ring-[0px]"
                />
            </div>

            <div>
                <Label className="mb-1">Family Name</Label>
                <Input
                    value={family}
                    onChange={e => setFamily(e.target.value)}
                    placeholder="Doe"
                    required
                    className="focus-visible:ring-[0px]"
                />
            </div>

            <div>
                <GenderSelect
                    selectedGender={selected?.gender}
                    onChange={setGender}
                />
            </div>

            <div>
                <Label className="mb-1">Date of Birth</Label>
                <Input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                />
            </div>

            <div>
                <Label className="mb-1">Phone</Label>
                <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="focus-visible:ring-[0px]"
                />
            </div>

            <div>
                <Label className="mb-1">Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="focus-visible:ring-[0px]"
                />
            </div>

            <div className="md:col-span-2">
                <Label className="mb-1">Address</Label>
                <Textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="focus-visible:ring-[0px]"
                    placeholder="123 Main St, City, Country"
                />
            </div>

            <div className="md:col-span-2 flex justify-end">
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:cursor-pointer"
                >
                    {selected ? 'Update' : 'Add Patient'}
                </Button>
            </div>
        </form>
    )
}
