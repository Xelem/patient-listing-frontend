import { useEffect, useState } from 'react'
import { Label } from './ui/label'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from './ui/select'

type Gender = 'male' | 'female' | 'other' | 'unknown' | 'undefined'

export default function GenderSelect({
    selectedGender,
    onChange,
}: {
    selectedGender?: Gender
    onChange: (gender: Gender) => void
}) {
    const [gender, setGender] = useState<Gender>(selectedGender || 'undefined')

    console.log('Selected Gender:', selectedGender)
    // Keep local state in sync with parent (selected patient)
    useEffect(() => {
        if (selectedGender) setGender(selectedGender)
    }, [selectedGender])

    const handleChange = (value: string) => {
        const g = value as Gender
        setGender(g)
        onChange(g)
    }

    return (
        <div className="space-y-2">
            <Label className="mb-1">Gender</Label>
            <Select value={gender} onValueChange={handleChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
