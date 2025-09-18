export function Sparkline({ points }: { points: number[] }) {
	const max = Math.max(...points);
	const min = Math.min(...points);
	const w = 120;
	const h = 36;
	const step = w / Math.max(1, points.length - 1);
	const norm = (v: number) => (h - 4) * (1 - (v - min) / Math.max(1, max - min)) + 2;
	let d = "";
	points.forEach((p, i) => {
		const x = i * step;
		const y = norm(p);
		d += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
	});
	return (
		<svg width={w} height={h} className="text-[var(--brand)]">
			<path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
		</svg>
	);
}

export function BarMini({ values }: { values: number[] }) {
	const w = 120;
	const h = 36;
	const gap = 2;
	const barW = (w - gap * (values.length - 1)) / values.length;
	const max = Math.max(...values, 1);
	return (
		<svg width={w} height={h}>
			{values.map((v, i) => {
				const bh = (h - 4) * (v / max);
				const x = i * (barW + gap);
				const y = h - bh - 2;
				return <rect key={i} x={x} y={y} width={barW} height={bh} className="fill-[var(--brand)] opacity-80" rx={2} />;
			})}
		</svg>
	);
}


