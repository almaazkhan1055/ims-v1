"use client";

import { Protected, RoleGate } from "@/components/auth/Protected";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useState } from "react";

type Role = "admin" | "ta_member" | "panelist";

interface MockUser {
	id: number;
	name: string;
	role: Role;
}

const initialUsers: MockUser[] = [
	{ id: 1, name: "Alice", role: "panelist" },
	{ id: 2, name: "Bob", role: "ta_member" },
	{ id: 3, name: "Charlie", role: "panelist" },
];

export default function AdminPage() {
	const [users, setUsers] = useState<MockUser[]>(initialUsers);

	function updateRole(id: number, role: Role) {
		setUsers((arr) => arr.map((u) => (u.id === id ? { ...u, role } : u)));
	}

	return (
		<Protected>
			<RoleGate allow={["admin"]}>
				<DashboardShell title="Admin">
					<p className="text-sm text-neutral-600 mb-2">UI-only simulation. No backend updates.</p>
					<div className="overflow-x-auto border rounded">
						<table className="w-full text-sm">
							<thead className="bg-neutral-50">
								<tr>
									<th className="text-left p-2">Name</th>
									<th className="text-left p-2">Role</th>
									<th className="text-left p-2">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr key={u.id} className="border-t">
										<td className="p-2">{u.name}</td>
										<td className="p-2">{u.role}</td>
										<td className="p-2">
											<select
												className="border rounded px-2 py-1"
												value={u.role}
												onChange={(e) => updateRole(u.id, e.target.value as Role)}
											>
												<option value="admin">admin</option>
												<option value="ta_member">ta_member</option>
												<option value="panelist">panelist</option>
											</select>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</DashboardShell>
			</RoleGate>
		</Protected>
	);
}


