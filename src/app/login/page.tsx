"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { loginSucceeded, type UserRole } from "@/features/auth/authSlice";
import { saveSession } from "@/lib/secureStorage";

const schema = z.object({
	username: z.string().min(1, "Username is required").max(64),
	password: z.string().min(1, "Password is required").max(128),
	role: z.enum(["admin", "ta_member", "panelist"] as const),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

	async function onSubmit(values: FormValues) {
    try {
        const res = await login({ username: values.username, password: values.password });
        const token = res.token ?? `client_${Math.random().toString(36).slice(2)}`;
        dispatch(
            loginSucceeded({
                accessToken: token,
                role: values.role as UserRole,
                user: {
                    id: res.id,
                    username: res.username,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                    image: res.image,
                },
            })
        );
        saveSession({ token, role: values.role, user: res });
        router.replace("/dashboard");
    } catch (err) {
        alert("Login failed. If DummyJSON auth is unavailable, try 'emilys' / 'emilyspass'. We'll simulate a token if needed.");
    }
	}

	return (
		<div className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-rose-50 to-red-50 dark:from-zinc-900 dark:to-zinc-950">
			<form
				className="w-full max-w-sm card"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-xl font-semibold mb-1">Sign in</h1>
				<p className="text-xs text-neutral-600 mb-2">Use DummyJSON credentials. Choose a role to simulate access.</p>
				<div className="space-y-1">
					<label className="label">Username</label>
					<input
						className="input"
						autoComplete="username"
						{...register("username")}
					/>
					{errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
				</div>
				<div className="space-y-1">
					<label className="label">Password</label>
					<input
						className="input"
						type="password"
						autoComplete="current-password"
						{...register("password")}
					/>
					{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
				</div>
				<div className="space-y-1">
					<label className="label">Role</label>
					<select className="input" {...register("role")}>
						<option value="admin">Admin</option>
						<option value="ta_member">TA Member</option>
						<option value="panelist">Panelist</option>
					</select>
					{errors.role && <p className="text-xs text-red-600">{errors.role.message as string}</p>}
				</div>
				<button type="submit" disabled={isSubmitting} className="btn-primary w-full">
					{isSubmitting ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</div>
	);
}


