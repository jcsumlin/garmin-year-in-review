import ReportWrapper from '@/components/report/ReportWrapper'
import StepProgress from '@/components/report/StepProgress';
import { Button } from '@/components/ui/button';
import GarminYearReview from '@/components/yearInReview';
import { useExportFile } from '@/providers/ExportFileProvider';
import { createFileRoute, Link } from '@tanstack/react-router'

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
