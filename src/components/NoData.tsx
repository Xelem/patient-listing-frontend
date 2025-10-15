import { User } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function NoData() {
    return (
        <Card className="mt-4 border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <User className="h-8 w-8 text-gray-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-700">
                    No Patients Found
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    It looks like there are no patients in the system yet.
                </p>
            </CardContent>
        </Card>
    )
}
