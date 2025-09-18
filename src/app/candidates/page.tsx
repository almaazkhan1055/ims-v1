"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Protected, RoleGate } from "@/components/auth/Protected";
import { DashboardShell } from "@/components/layout/DashboardShell";
import Link from "next/link";

interface UserItem {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	company?: { department?: string };
	role?: string;
	status?: "scheduled" | "completed" | "no_show";
	username: string;
}

export default function CandidatesPage() {
	const [users, setUsers] = useState<UserItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState("");
	const [sort, setSort] = useState<"name" | "department">("name");
	const [page, setPage] = useState(1);
	const pageSize = 10;

	// Debounced query
	const [dq, setDq] = useState("");
	useEffect(() => {
		const id = setTimeout(() => setDq(q), 250);
		return () => clearTimeout(id);
	}, [q]);

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		api
			.get<{ users: UserItem[] }>("/users")
			.then((res) => {
				if (!ignore) setUsers(res.data.users || []);
			})
			.catch(() => setError("Failed to load candidates"))
			.finally(() => setLoading(false));
		return () => {
			ignore = true;
		};
	}, []);

	const filtered = useMemo(() => {
		const needle = dq.trim().toLowerCase();
		const arr = users.filter((u) => {
			const full = `${u.firstName} ${u.lastName}`.toLowerCase();
			return !needle || full.includes(needle) || u.username.toLowerCase().includes(needle);
		});
		arr.sort((a, b) => {
			if (sort === "name") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
			return (a.company?.department || "").localeCompare(b.company?.department || "");
		});
		return arr;
	}, [users, q, sort, dq]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	return (
		<Protected>
			<DashboardShell title="Candidates">
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<input
						className="input w-full sm:w-72"
						placeholder="Search by name or username"
						value={q}
						onChange={(e) => {
							setQ(e.target.value);
							setPage(1);
						}}
					/>
					<select
						className="input"
						value={sort}
						onChange={(e) => setSort(e.target.value as 'name' | 'department')}
					>
						<option value="name">Sort: Name</option>
						<option value="department">Sort: Department</option>
					</select>
				</div>

				{loading && <p>Loading...</p>}
				{error && <p className="text-red-600 text-sm">{error}</p>}

				{!loading && !error && (
					<div className="overflow-x-auto card">
						<table className="w-full text-sm">
						<thead className="bg-neutral-50">
								<tr>
								<th className="text-left p-3">Name</th>
								<th className="text-left p-3">Department</th>
									<th className="text-left p-3">Username</th>
									<th className="text-left p-3">Role</th>
									<th className="text-left p-3">Status</th>
								<th className="text-left p-3">Actions</th>
								</tr>
							</thead>
						<tbody className="divide-y">
								{pageItems.map((u) => (
								<tr key={u.id} className="hover:bg-neutral-50">
									<td className="p-3">{u.firstName} {u.lastName}</td>
									<td className="p-3">{u.company?.department || "-"}</td>
									<td className="p-3">{u.username}</td>
									<td className="p-3">{u.role || "-"}</td>
									<td className="p-3">{u.status || "scheduled"}</td>
									<td className="p-3">
											<div className="flex gap-2">
											<RoleGate allow={["admin", "ta_member", "panelist"]}>
												<Link href={`/candidates/${u.id}`} className="text-[var(--brand)] hover:underline">View Details</Link>
											</RoleGate>
											<RoleGate allow={["panelist"]}>
												<Link href={`/candidates/${u.id}#feedback`} className="text-[var(--brand)] hover:underline">Submit Feedback</Link>
											</RoleGate>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="flex items-center justify-between pt-3">
					<p className="text-xs text-neutral-600">
						Page {page} / {totalPages} ({filtered.length} records)
					</p>
					<div className="flex gap-2">
						<button
							disabled={page <= 1}
							className="border px-3 py-1 rounded disabled:opacity-50"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							Prev
						</button>
						<button
							disabled={page >= totalPages}
							className="border px-3 py-1 rounded disabled:opacity-50"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						>
							Next
						</button>
					</div>
				</div>
			</DashboardShell>
		</Protected>
	);
}


