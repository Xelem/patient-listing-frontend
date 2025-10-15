import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PatientProvider } from './context/PatientProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PatientProvider>
            <App />
        </PatientProvider>
    </StrictMode>,
)
