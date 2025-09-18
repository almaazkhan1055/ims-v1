"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Protected({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

	useEffect(() => {
		if (!isAuthenticated) router.replace("/login");
	}, [isAuthenticated, router]);

	if (!isAuthenticated) return null;
	return <>{children}</>;
}

export function RoleGate({
	allow,
	children,
}: {
	allow: ("admin" | "ta_member" | "panelist")[];
	children: React.ReactNode;
}) {
	const role = useSelector((s: RootState) => s.auth.role);
	if (!role || !allow.includes(role)) return null;
	return <>{children}</>;
}


