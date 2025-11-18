import { Skeleton } from "@/shared/components/ui/skeleton"

export default function MovementsCardsSkeleton(): React.ReactElement {
	return (
		<div className="grid h-100 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-full w-full lg:col-span-3" />

			<Skeleton className="h-full w-full" />
		</div>
	)
}
