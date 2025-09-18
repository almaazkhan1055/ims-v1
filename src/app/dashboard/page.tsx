"use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
import { Protected } from "@/components/auth/Protected";
// import { KpiCard } from "@/components/kpi/KpiCard";
import { DashboardShell } from "@/components/layout/DashboardShell";
// import { useState } from "react";
import { Sparkline, BarMini } from "@/components/kpi/MiniChart";

export default function DashboardPage() {
    // TODO: Implement dashboard filtering and KPI features
    // const role = useSelector((s: RootState) => s.auth.role);
    // const [filterRole, setFilterRole] = useState<"all" | "admin" | "ta_member" | "panelist">("all");
    // const [interviewer, setInterviewer] = useState("");
    // const [range, setRange] = useState<{ from?: string; to?: string }>({});

	return (
		<Protected>
            <DashboardShell title="Overview">
                {/* Charts-enhanced KPIs */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500">Interviews this week</p>
                                <p className="text-3xl font-bold">8</p>
                            </div>
                            <BarMini values={[2,1,3,2,4,5,8]} />
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500">Avg feedback score</p>
                                <p className="text-3xl font-bold">4.3</p>
                            </div>
                            <Sparkline points={[3.8,4.0,4.1,4.2,4.0,4.5,4.3]} />
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500">No-shows</p>
                                <p className="text-3xl font-bold">1</p>
                            </div>
                            <BarMini values={[1,0,1,0,2,1,1]} />
                        </div>
                    </div>
				</div>
			</DashboardShell>
		</Protected>
	);
}


