"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/features/auth/authSlice";
import { clearSession } from "@/lib/secureStorage";
import { useRouter } from "next/navigation";

export function Header() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { isAuthenticated, role } = useSelector((s: RootState) => s.auth);

	function onLogout() {
		dispatch(logout());
		clearSession();
		router.replace("/login");
	}

	return (
		<header className="w-full border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
			<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
				<nav className="flex items-center gap-4 text-sm">
					<Link href="/dashboard" className="hover:underline">
						Dashboard
					</Link>
					{isAuthenticated && (
						<Link href="/admin" className="hover:underline">
							Admin
						</Link>
					)}
					{isAuthenticated && (
						<Link href="/candidates" className="hover:underline">
							Candidates
						</Link>
					)}
				</nav>
				<div className="flex items-center gap-3">
					{isAuthenticated && <span className="text-xs text-neutral-600">Role: {role}</span>}
					{isAuthenticated ? (
						<button onClick={onLogout} className="text-sm border px-3 py-1 rounded">
							Logout
						</button>
					) : (
						<Link href="/login" className="text-sm border px-3 py-1 rounded">
							Login
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}


