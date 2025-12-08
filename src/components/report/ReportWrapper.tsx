import { ReactNode } from 'react'

export default function ReportWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 pb-8">
            <div className="max-w-md mx-auto">{children}</div>
        </div>
    )
}
