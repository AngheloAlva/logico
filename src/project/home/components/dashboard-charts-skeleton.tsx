import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export default function DashboardChartsSkeleton() {
	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="border-gray-200">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>

			<Card className="border-gray-200">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>

			<Card className="border-gray-200 lg:col-span-2">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>
		</div>
	)
}
