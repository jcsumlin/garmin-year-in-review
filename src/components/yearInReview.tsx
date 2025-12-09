import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import JSZip from 'jszip';
import type { ActivitiesExport, GarminActivity, DailySummary } from 'garmin-export-parser';
import type { ActivityState, Month, SleepData, Stats, StepSectionData } from '@/types';
import { cn } from '@/lib/utils';
import ReportWrapper from './report/ReportWrapper';
import StepSection from './report/StepSection';
import SleepSection from './report/SleepSection';
import { useExportFile } from '@/providers/ExportFileProvider';
import StepProgress from './report/StepProgress';
import ActivitySection from './report/ActivitySection';

const cmToMile = 0.00000621
const reportYear = 2025;

const formatDuration = (milliseconds: number) => {
    const minutes = milliseconds / 60000
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};


async function getSleepData(files: { [key: string]: JSZip.JSZipObject }, jsonFiles: string[]): Promise<SleepData[]> {
    const regexPattern = new RegExp("DI\-Connect\-Wellness\/2025|2024\-\d{2}\-\d{2}\_2024|2025\-\d{2}\-\d{2}\_\d+\_sleepData.json")

    const sleepData: SleepData[] = [];
    for (const file of jsonFiles) {
        if (regexPattern.test(file)) {
            console.log('Found sleep file:', file);
            const fileContent = await files[file].async('string');
            const sleepJson = JSON.parse(fileContent) as SleepData[];
            sleepJson.forEach(sleep => {
                const date = new Date(sleep.calendarDate);
                if (date.getFullYear() === reportYear && sleep.sleepScores) {
                    sleepData.push(sleep);
                }
            });
        }
    }
    return sleepData;
}

async function getStepData(files: { [key: string]: JSZip.JSZipObject }, jsonFiles: string[]): Promise<StepSectionData> {
    const regexPattern = new RegExp("2025|2024\-\d{2}\-\d{2}\_2024|2025\-\d{2}\-\d{2}$")
    const dailySummaries: DailySummary[] = []
    for (const stats of jsonFiles.filter(fname => regexPattern.test(fname))) {
        const fileContent = await files[stats].async('string');
        const statsJson = JSON.parse(fileContent) as DailySummary[]
        dailySummaries.push(...statsJson)
    }
    const monthlySteps: Record<Month, number> = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };
    let highestStepDay: { date: string; steps: number; } | null = null;
    dailySummaries.forEach(summary => {
        const date = new Date(summary.calendarDate);
        if (date.getFullYear() === reportYear) {
            const month = date.toLocaleString('default', { month: 'short' }) as Month;
            const steps = summary.totalSteps || 0;
            monthlySteps[month] = (monthlySteps[month] || 0) + steps;
            if (!highestStepDay || steps > highestStepDay.steps) {
                highestStepDay = { date: summary.calendarDate, steps };
            }
        }
    });

    return { monthlySteps, highestStepDay };
}

async function getActivityData(files: { [key: string]: JSZip.JSZipObject }, jsonFiles: string[], year = reportYear): Promise<ActivityState> {
    // Parse all JSON files
    let thisYearActivities: GarminActivity[] = [];
    const summaryFile = jsonFiles.find(fname => fname.includes('summarizedActivities.json'));
    if (!summaryFile) {
        throw new Error('Could not find summarizedActivities.json file!')
    }
    const summaryActivities: ActivitiesExport[] = summaryFile ? JSON.parse(await files[summaryFile].async('string')) : [];
    if (summaryActivities.length === 0) {
        throw new Error('summarizedActivities.json file could not be read!')
    }
    const favoriteActivityMap: Record<string, number> = {};
    let longestActivity = 0;
    const monthlyActivities: number[] = Array(12).fill(0);
    let activityCount = 0;
    let totalDuration = 0;
    let totalCalories = 0;


    summaryActivities[0].summarizedActivitiesExport.forEach((activity) => {
        const timestamp = activity.beginTimestamp
        var date = new Date(timestamp);

        if (date.getFullYear() === year) {
            if (Object.keys(favoriteActivityMap).includes(activity.activityType)) {
                favoriteActivityMap[activity.activityType] += 1
            } else {
                favoriteActivityMap[activity.activityType] = 1
            }
            if (activity.duration > longestActivity) {
                longestActivity = activity.duration
            }
            const activityDate = new Date(activity.beginTimestamp)
            monthlyActivities[activityDate.getMonth()] += 1
            activityCount++;
            totalDuration += activity.duration
            totalCalories += activity.calories

            return thisYearActivities.push(activity);
        }
    });

    if (thisYearActivities.length === 0) {
        throw new Error('No activities for 2025 found in the files');
    }

    const favoriteActivity = Object.entries(favoriteActivityMap).sort((a, b) => b[1] - a[1])[0];
    const avgDuration = totalDuration / activityCount;
    const mostActiveMonth = Object.entries(monthlyActivities).sort((a, b) => b[1] - a[1])[0];
    const longestActivityFormatted = formatDuration(longestActivity);
    return {
        averageDuration: Math.round(avgDuration / 1000),
        totalActivities: thisYearActivities.length,
        totalCalories: Math.round(thisYearActivities.reduce((acc, curr) => acc + (curr.calories || 0), 0)),
        favoriteActivity: favoriteActivity ? favoriteActivity[0] : '',
        favoriteActivityCount: favoriteActivity ? favoriteActivity[1] : 0,
        longestActivity: longestActivityFormatted,
        mostActiveMonth: mostActiveMonth ? mostActiveMonth[0] : '',
        mostActiveMonthCount: mostActiveMonth ? mostActiveMonth[1] : 0
    }
}




export default function GarminYearReview() {
    const [data, setData] = useState<Stats[] | null>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: contents, files: jsonFiles } = useExportFile();

    const handleFileUpload = async () => {
        try {
            if (!contents || !jsonFiles) {
                throw new Error('No data available. Please upload a Garmin ZIP file from the home page.');
            }

            setLoading(true);
            setError(null);
            const sleepData = await getSleepData(contents, jsonFiles);
            const stepData = await getStepData(contents, jsonFiles);
            const activityData = await getActivityData(contents, jsonFiles);
            const lastYearActivityData = await getActivityData(contents, jsonFiles, reportYear - 1);

            const thisYearStats = {
                stepData,
                activityData,
                sleepData
            }
            const lastYearStats = {
                stepData: {
                    monthlySteps: {
                        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
                        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
                    },
                    highestStepDay: null
                },
                activityData: lastYearActivityData,
                sleepData: [] as SleepData[]
            }

            setData([thisYearStats, lastYearStats]);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to process ZIP file. Please ensure it\'s a valid Garmin export.');
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFileUpload();
    }, []);


    const moreActivitiesThisYear = data && (data[0].activityData.totalActivities - data[1].activityData.totalActivities) > 0

    if (loading) {
        return (
            <ReportWrapper>
                <div className="text-center mt-10">
                    <p className="text-lg font-medium">Processing your data...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment.</p>
                </div>
            </ReportWrapper>
        );
    }
    if (error || !data) {
        return (
            <ReportWrapper>
                <div className="text-center mt-10">
                    <p className="text-lg font-medium text-red-600">Error</p>
                    <p className="text-sm text-gray-500 mt-2">{error}</p>
                    <Button
                        asChild
                        variant="outline"
                    >
                        <a href="/" className="mt-4 inline-block text-blue-600 underline">
                            Upload Different File
                        </a>
                    </Button>
                </div>
            </ReportWrapper>
        );
    }

    return (
        <ReportWrapper>
            <div className="space-y-4 animate-in fade-in duration-500">
                <StepProgress>
                    <Card className="h-[calc(100vh-7rem)] bg-linear-to-br from-blue-500 to-purple-600 text-white border-0">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm opacity-90 mb-2">Total Activities Logged this year</p>
                                <p className="text-6xl font-bold mb-2">{data[0].activityData.totalActivities}</p>
                                <div className='flex justify-center'>
                                    {moreActivitiesThisYear ? <ArrowUp className='my-auto text-green-500' /> : <ArrowDown className={cn('my-auto text-red-500')} />}
                                    <p className={cn('text-5xl font-bold mb-2', (moreActivitiesThisYear ? "text-green-500" : 'text-red-500'))}>
                                        {data[0].activityData.totalActivities - data[1].activityData.totalActivities} <span className='text-sm text-white'>yoy</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <StepSection data={data[0].stepData} />
                    <SleepSection sleepData={data[0].sleepData} />
                    <ActivitySection activityData={data[0].activityData} />
                    <Card className="h-[calc(100vh-7rem)] bg-linear-to-br from-green-50 to-blue-50 border-green-200">
                        <CardContent className="pt-6 text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                                Amazing work this year! 🎉
                            </p>
                            <p className="text-sm text-gray-600">
                                You've shown incredible dedication. Here's to an even stronger {reportYear + 1}!
                            </p>
                        </CardContent>
                    </Card>
                </StepProgress>
                {/* Reset Button */}
                <Button
                    onClick={() => setData(null)}
                    variant="outline"
                    className="w-full"
                >
                    Upload Different File
                </Button>
            </div>
        </ReportWrapper>
    );
}