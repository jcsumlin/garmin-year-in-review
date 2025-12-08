import Steps from '@/components/Steps'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Pause } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(50)
  const [paused, setPaused] = useState(false)
  return <div>
    <div className='flex mb-4'>
      <Progress value={activeStep < 0 ? progress : 0} className="" />
      <Progress value={activeStep < 1 ? progress : 0} className="ml-1" />
      <Progress value={activeStep < 2 ? progress : 0} className="ml-1" />
      <Progress value={activeStep < 3 ? progress : 0} className="ml-1" />
      <Progress value={activeStep < 4 ? progress : 0} className="ml-1" />
    </div>
    <div className='flex justify-between mb-8'>
      <div className=''>
        <h1><strong>Garmin</strong> Year in Review</h1>
      </div>
      <div>
        <Pause className={cn('inline-block mr-2', paused && 'text-red-500')} size={16} onClick={() => setPaused(!paused)} />
      </div>
    </div>
    <Steps />

    <strong>123</strong> Steps
    <strong>80 avg</strong> Sleep Score
    <strong>70 avg high</strong> Body Battery
    <strong>123</strong> Total Activities
    <strong>123 Running</strong> Top Activity
    <strong>123h 123m</strong> Activity Time
    <strong>2.5km</strong> Activity Distance
    <strong>320m</strong> Activity Ascent
    <strong>123</strong> Active Calories
  </div>
}
