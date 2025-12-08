import StepsFeet from '@/assets/images/steps.svg?react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, XAxis } from 'recharts';


function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export default function StepSection({ steps }: { steps: Record<string, number> }) {
    const totalSteps = Object.values(steps).reduce((a, b) => a + b, 0);
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const stepData = Object.entries(steps)
        .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
        .map(([name, value]) => ({ name, value }));

    return (
        <section className='h-lvh bg-linear-to-b from-sky-500 from-10% via-gray-900 via-50% to-gray-900 to-90% rounded-lg p-6 flex flex-col'>
            <div className='bg-blue-500 rounded-full flex py-2 px-4 w-fit my-4'>
                <StepsFeet className='fill-white size-5 mr-2 my-auto' />
                <h2 className='text-xl font-bold text-white'>STEPS</h2>
            </div>
            <div className='text-center my-4'>
                <p className='text-7xl font-bold text-white'>{numberWithCommas(totalSteps)}</p>
                <p className='text-white mt-2'>Total Steps</p>
            </div>
            <p className='text-4xl text-white'>Thats over {Math.round(totalSteps / 2000)} miles - More than {Math.floor(totalSteps / 2000 / 26.2)} marathons</p>

            <ChartContainer config={chartConfig} className='mt-6 flex-1'>
                <BarChart data={stepData} accessibilityLayer>
                    <Bar dataKey="value" fill={chartConfig.desktop.color} radius={4} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
            </ChartContainer>
        </section>
    )
}
