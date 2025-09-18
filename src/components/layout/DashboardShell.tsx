"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Users, Shield, LogOut, Menu as MenuIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/features/auth/authSlice";
import { clearSession } from "@/lib/secureStorage";

function NavItem({ href, label, Icon }: { href: string; label: string; Icon: any }) {
	const pathname = usePathname();
	const active = pathname.startsWith(href);
	return (
		<Link
			href={href}
			className={`px-3 py-2 rounded text-sm flex items-center gap-2 ${
				active
					? "bg-neutral-200 dark:bg-neutral-800 font-medium text-[var(--brand)]"
					: "hover:bg-neutral-100 dark:hover:bg-neutral-900"
			}`}
		>
			<Icon size={16} />
			{label}
		</Link>
	);
}

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const role = useSelector((s: RootState) => s.auth.role);
	const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

	function onLogout() {
		dispatch(logout());
		clearSession();
		router.replace("/login");
	}
return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-rose-50 dark:from-zinc-900 dark:to-zinc-950">
			{/* Top header */}
			<div className="h-14 border-b bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 flex items-center justify-between px-4 sticky top-0 z-10">
				<div className="flex items-center gap-3">
					<button className="lg:hidden btn-outline" onClick={() => setOpen((v) => !v)} aria-label="Toggle sidebar">
						<MenuIcon size={16} />
					</button>
					<h1 className="text-lg font-semibold">{title}</h1>
				</div>
				<div className="flex items-center gap-3">
					{isAuthenticated && (
						<span className="text-xs px-2 py-1 rounded-full bg-[var(--brand)] text-[var(--brand-foreground)] capitalize">{role}</span>
					)}
					<ThemeToggle />
					{isAuthenticated && (
						<button onClick={onLogout} className="btn-outline flex items-center gap-1">
							<LogOut size={14} /> Logout
						</button>
					)}
				</div>
			</div>

			{/* Below header: sidebar + main */}
			<div className="flex-1 lg:grid lg:grid-cols-[260px_1fr]">
				<aside className={`${open ? "block" : "hidden"} lg:block border-r bg-white/90 dark:bg-zinc-950/90 backdrop-blur p-4`}>
					<div className="h-12 flex items-center font-semibold text-[var(--brand)]">IMS Dashboard</div>
					<nav className="flex flex-col gap-1">
						<NavItem href="/dashboard" label="Overview" Icon={Home} />
						<NavItem href="/candidates" label="Candidates" Icon={Users} />
						<NavItem href="/admin" label="Admin" Icon={Shield} />
					</nav>
				</aside>
				<main className="p-6 max-w-7xl mx-auto w-full space-y-6">{children}</main>
			</div>
		</div>
	);
}


