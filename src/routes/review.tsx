import GarminYearReview from '@/components/yearInReview'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/review')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><GarminYearReview /></div>
}
