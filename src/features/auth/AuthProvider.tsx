"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bootstrapSession } from "@/features/auth/authSlice";
import { readSession } from "@/lib/secureStorage";
import { AuthSession } from "./types";

export function AuthBootstrapper() {
	const dispatch = useDispatch();

	useEffect(() => {
		const session = readSession<AuthSession>();
		if (session?.token && session?.role && session?.user) {
			dispatch(
				bootstrapSession({
					isAuthenticated: true,
					accessToken: session.token,
					role: session.role,
					user: {
						id: session.user.id,
						username: session.user.username,
						firstName: session.user.firstName,
						lastName: session.user.lastName,
						email: session.user.email,
						image: session.user.image,
					},
				})
			);
		}
	}, [dispatch]);

	return null;
}


