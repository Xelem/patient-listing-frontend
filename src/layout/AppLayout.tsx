import { type ReactNode } from 'react'
import Navbar from '../components/Navbar'

interface Props {
    children: ReactNode
}

export default function AppLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="bg-gray-100">{children}</main>
        </div>
    )
}
