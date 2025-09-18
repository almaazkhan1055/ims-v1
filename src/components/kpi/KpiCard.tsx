export function KpiCard({ title, value }: { title: string; value: string | number }) {
	return (
		<div className="card">
			<p className="text-xs text-neutral-500">{title}</p>
			<p className="text-3xl font-bold tracking-tight">{value}</p>
		</div>
	);
}


