import { Skeleton } from "@/shared/components/ui/skeleton"
import { Card } from "@/shared/components/ui/card"

export default function StatsCardsSkeleton(): React.ReactElement {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<Card className="border-gray-200 transition-all hover:shadow-md">
				<Skeleton className="h-24 w-full" />
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<Skeleton className="h-24 w-full" />
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<Skeleton className="h-24 w-full" />
			</Card>

			<Card className="border-gray-200 transition-all hover:shadow-md">
				<Skeleton className="h-24 w-full" />
			</Card>
		</div>
	)
}
