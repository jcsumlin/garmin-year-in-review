import { SleepData } from '@/types'
import { Moon } from 'lucide-react'
import { parse } from 'date-fns'

const sleepAnalysisMessages = {
    20: 'Poor sleep quality. Focus on sleep hygiene and consider adjusting your bedtime routine.',
    30: 'Below average sleep. Try creating a consistent sleep schedule and reducing screen time before bed.',
    40: 'Fair sleep quality. Your body got some rest, but there\'s room for improvement.',
    50: 'Good sleep! You\'re getting decent rest to support your daily activities.',
    60: 'Very good sleep quality. Your body is recovering well and you should feel refreshed.',
    70: 'Excellent sleep! You\'re well-prepared for the challenges of the day ahead.',
    80: 'Outstanding sleep quality. Your body achieved optimal recovery with good sleep stages.',
    90: 'Exceptional sleep! Near-perfect balance of sleep stages and duration.',
    100: 'Perfect sleep score! Optimal recovery achieved - you\'re ready to conquer the day!',
}

export default function SleepSection({ sleepData }: { sleepData: SleepData[] }) {
    const averageSleepScore = sleepData.reduce((acc, curr) => acc + (curr.sleepScores?.overallScore || 0), 0) / sleepData.length || 0
    const highestSleepScoreDay = sleepData.reduce((prev, current) => (prev.sleepScores && current.sleepScores && (prev.sleepScores.overallScore > current.sleepScores.overallScore) ? prev : current), sleepData[0]);
    return (
        <section className='h-[calc(100vh-7rem)] bg-linear-to-b from-indigo-500 from-10% via-gray-900 via-50% to-gray-900 to-90% rounded-lg p-6 flex flex-col'>
            <div className='bg-purple-500 rounded-full flex py-2 px-4 w-fit my-4'>
                <Moon className='fill-white size-5 mr-2 my-auto' />
                <h2 className='text-xl font-bold text-white'>SLEEP SCORE</h2>
            </div>
            <div className='text-center my-4'>
                <p className='text-7xl font-bold text-white'>{averageSleepScore.toFixed(0)}</p>
                <p className='text-white mt-2'>Average Sleep Score</p>
            </div>
            <p className='text-4xl text-white'>{Object.entries(sleepAnalysisMessages).find(([score]) => averageSleepScore < Number(score))?.[1]}</p>
            {highestSleepScoreDay && highestSleepScoreDay.sleepScores && (
                <p className='text-2xl text-white mt-4'>Your highest sleep score was {highestSleepScoreDay.sleepScores.overallScore} on {parse(highestSleepScoreDay.calendarDate, 'yyyy-MM-dd', new Date()).toLocaleDateString()}</p>
            )}
        </section>
    )
}
