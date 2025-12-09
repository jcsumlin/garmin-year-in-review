
export interface SummarizedActivityExport {
    activityId: number
    uuidMsb: number
    uuidLsb: number
    name: string
    activityType: string
    userProfileId: number
    timeZoneId: number
    beginTimestamp: number
    eventTypeId: number
    rule: string
    sportType?: string
    startTimeGmt: number
    startTimeLocal: number
    duration: number
    distance?: number
    avgSpeed?: number
    avgHr?: number
    maxHr?: number
    minHr?: number
    steps?: number
    calories?: number
    bmrCalories?: number
    avgFractionalCadence: number
    maxFractionalCadence: number
    elapsedDuration: number
    movingDuration?: number
    deviceId: number
    summarizedExerciseSets?: SummarizedExerciseSet[]
    summarizedDiveInfo: SummarizedDiveInfo
    manufacturer?: string
    lapCount: number
    waterEstimated?: number
    activeSets?: number
    totalSets?: number
    totalReps?: number
    trainingEffectLabel?: string
    aerobicTrainingEffectMessage?: string
    anaerobicTrainingEffectMessage?: string
    moderateIntensityMinutes?: number
    vigorousIntensityMinutes?: number
    differenceBodyBattery?: number
    hrTimeInZone_0?: number
    hrTimeInZone_1?: number
    hrTimeInZone_2?: number
    hrTimeInZone_3?: number
    hrTimeInZone_4?: number
    hrTimeInZone_5?: number
    hrTimeInZone_6?: number
    decoDive: boolean
    purposeful: boolean
    autoCalcCalories: boolean
    favorite: boolean
    pr: boolean
    elevationCorrected: boolean
    atpActivity: boolean
    parent: boolean
    elevationGain?: number
    elevationLoss?: number
    maxSpeed?: number
    avgRunCadence?: number
    maxRunCadence?: number
    startLongitude?: number
    startLatitude?: number
    avgStrideLength?: number
    minElevation?: number
    maxElevation?: number
    avgDoubleCadence?: number
    maxDoubleCadence?: number
    locationName?: string
    maxVerticalSpeed?: number
    endLongitude?: number
    endLatitude?: number
    maxLatitude?: number
    maxLongitude?: number
    minLatitude?: number
    minLongitude?: number
    avgVerticalSpeed?: number
    vO2MaxValue?: number
    avgPower?: number
    maxPower?: number
    normPower?: number
    avgVerticalOscillation?: number
    avgGroundContactTime?: number
    avgVerticalRatio?: number
    splitSummaries?: SplitSummary[]
    splits?: Split[]
    isRunPowerWindDataEnabled?: boolean
    powerTimeInZone_0?: number
    powerTimeInZone_1?: number
    powerTimeInZone_2?: number
    powerTimeInZone_3?: number
    powerTimeInZone_4?: number
    powerTimeInZone_5?: number
    runPowerWindDataEnabled?: boolean
    workoutFeel?: number
    workoutRpe?: number
    workoutId?: number
    avgBikeCadence?: number
    maxBikeCadence?: number
    minRespirationRate?: number
    maxRespirationRate?: number
    avgRespirationRate?: number
    startStress?: number
    endStress?: number
    differenceStress?: number
    avgStress?: number
    maxStress?: number
    maxDepth?: number
    avgDepth?: number
    surfaceInterval?: number
    floorsDescended?: number
    bottomTime?: number
    description?: string
}

export interface SummarizedActivities {
    summarizedActivitiesExport: SummarizedActivityExport[]
}


export interface SummarizedExerciseSet {
    category: string
    reps: number
    volume: number
    duration: number
    sets: number
    maxWeight?: number
    subCategory?: string
}

export interface SummarizedDiveInfo { }

export interface SplitSummary {
    noOfSplits?: number
    duration: number
    type: number
    numFalls: number
    numClimbSends: number
    numClimbsAttempted: number
    numClimbsCompleted: number
    maxDistance?: number
    distance?: number
    averageSpeed?: number
    avgStress?: number
    maxSpeed?: number
    totalAscent?: number
    maxElevationGain?: number
    averageElevationGain?: number
    elevationLoss?: number
}

export interface Split {
    startTimeSource: number
    endTimeSource: number
    startTimeGMT: number
    endTimeGMT: number
    messageIndex: number
    type: number
    startIndex: number
    endIndex: number
    totalExerciseReps: number
    measurements: Measurement[]
    startLatitude?: number
    startLongitude?: number
    lapIndexes?: number[]
    endLatitude?: number
    endLongitude?: number
}

export interface Measurement {
    value?: number
    connectIQ: boolean
    unitEnum: string
    fieldEnum: string
    valid: boolean
}


interface StepSectionData {
    monthlySteps: Record<Month, number>;
    highestStepDay: { date: string; steps: number; } | null;
}

interface Stats {
    totalActivities: number;
    totalDistance: string;
    totalDuration: number;
    totalCalories: number;
    favoriteActivity: string;
    favoriteActivityCount: number
    longestActivity: number;
    avgDuration: number;
    mostActiveMonth: string;
    stepData: StepSectionData;
    sleepData: SleepData[];
    mostActiveMonthCount: number;
}
export interface SleepData {
    sleepStartTimestampGMT: string
    sleepEndTimestampGMT: string
    calendarDate: string
    sleepWindowConfirmationType: string
    deepSleepSeconds: number
    lightSleepSeconds: number
    remSleepSeconds: number
    awakeSleepSeconds: number
    unmeasurableSeconds: number
    averageRespiration: number
    lowestRespiration: number
    highestRespiration: number
    retro: boolean
    awakeCount: number
    avgSleepStress: number
    sleepScores: SleepScores
    restlessMomentCount: number
}

export interface SleepScores {
    overallScore: number
    qualityScore: number
    durationScore: number
    recoveryScore: number
    deepScore: number
    remScore: number
    lightScore: number
    awakeningsCountScore: number
    awakeTimeScore: number
    combinedAwakeScore: number
    restfulnessScore: number
    interruptionsScore: number
    feedback: string
    insight: string
}

export type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

