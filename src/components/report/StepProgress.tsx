import { cn } from '@/lib/utils'
import { ListRestart, Pause } from 'lucide-react'
import { useState, useEffect, type ReactNode } from 'react'
import { Progress } from '../ui/progress'

export default function StepProgress({ children }: { children: ReactNode[] }) {
    const [activeStep, setActiveStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [paused, setPaused] = useState(false)

    // Auto-increment progress over 10s until 100 for the current step
    useEffect(() => {
        if (paused) return
        if (activeStep >= 4) return

        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 1, 100)) // 100ms * 100 increments = 10 seconds
        }, 100)

        return () => clearInterval(interval)
    }, [paused, activeStep])

    // When progress hits 100, advance to the next step once and reset progress
    useEffect(() => {
        if (progress === 100 && activeStep < 4) {
            setActiveStep(s => s + 1)
            setProgress(0)
        }
    }, [progress, activeStep])

    const getProgress = (step: number) => {
        if (activeStep > step) return 100
        if (activeStep === step) return progress
        return 0
    }

    const setStep = (step: number) => () => {
        setActiveStep(step)
        setProgress(0)
    }

    return (
        <div>
            <div className='flex mb-4 gap-1'>
                <Progress value={getProgress(0)} onClick={setStep(0)} />
                <Progress value={getProgress(1)} onClick={setStep(1)} />
                <Progress value={getProgress(2)} onClick={setStep(2)} />
                <Progress value={getProgress(3)} onClick={setStep(3)} />
                <Progress value={getProgress(4)} onClick={setStep(4)} />
            </div>
            <div className='flex justify-between mb-8'>
                <ListRestart onClick={() => setActiveStep(0)} />
                <Pause className={cn('inline-block mr-2', paused && 'text-red-500')} size={16} onClick={() => setPaused(!paused)} />
            </div>
            {children[activeStep]}
        </div>
    )
}
