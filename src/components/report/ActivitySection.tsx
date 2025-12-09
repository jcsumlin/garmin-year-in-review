import { ActivityState } from '@/types'
import { Flame, PersonStanding, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { startCase } from 'lodash';
import { numberWithCommas } from './StepSection';

function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec${secs !== 1 ? 's' : ''}`);

    return parts.join(' ');
}

export default function ActivitySection({ activityData }: { activityData: ActivityState }) {
    return (
        <section className='h-[calc(100vh-7rem)] bg-linear-to-b from-orange-500 from-10% via-gray-900 via-50% to-gray-900 to-90% rounded-lg p-6 flex flex-col'>
            <div className='bg-yellow-500 rounded-full flex py-2 px-4 w-fit my-4'>
                <PersonStanding className='fill-white color-white size-5 mr-2 my-auto' />
                <h2 className='text-xl font-bold text-white'>ACTIVITIES</h2>
            </div>
            <p className='text-3xl font-bold text-white'>You burned over {numberWithCommas(activityData.totalCalories)} calories! - Thats like {numberWithCommas(Math.round(activityData.totalCalories / 305))} slices of peperoni pizza!</p>
            <div className="grid grid-cols-2 gap-4 my-4">
                {/* <Card>
                    <CardContent className="pt-6">
                        <Activity className="w-8 h-8 text-blue-500 mb-3" />
                        <p className="text-2xl font-bold">{activityData.totalDistance}</p>
                        <p className="text-sm text-gray-600">mi ran/walked</p>
                    </CardContent>
                </Card> */}

                {/* <Card>
                    <CardContent className="pt-6">
                        <Clock className="w-8 h-8 text-green-500 mb-3" />
                        <p className="text-2xl font-bold">{formatDuration(activityData.totalDuration)}</p>
                        <p className="text-sm text-gray-600">total time</p>
                    </CardContent>
                </Card> */}

                <Card>
                    <CardContent className="pt-6">
                        <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                        <p className="text-2xl font-bold">{formatDuration(activityData.averageDuration)}</p>
                        <p className="text-sm text-gray-600">avg workout</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                        <p className="text-2xl font-bold">{startCase(activityData.favoriteActivity)}</p>
                        <p className="text-sm text-gray-600">Favorite activity</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
