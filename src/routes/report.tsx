import ReportWrapper from '@/components/report/ReportWrapper'
import GarminYearReview from '@/components/yearInReview';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/report')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ReportWrapper>
      <GarminYearReview />
    </ReportWrapper>
  );
}
