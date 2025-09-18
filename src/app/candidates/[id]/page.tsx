"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Protected, RoleGate } from "@/components/auth/Protected";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserDetail {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	company?: { department?: string, name?: string };
	image?: string;
}

interface TodoItem { id: number; todo: string; completed: boolean }
interface PostItem { id: number; title: string; body: string }

const feedbackSchema = z.object({
	score: z.number().min(1).max(5),
	strengths: z.string().min(5).max(500),
	improvements: z.string().min(5).max(500),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

function DetailContent({ id }: { id: number }) {
	const params = useParams<{ id: string }>();
	const [user, setUser] = useState<UserDetail | null>(null);
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [posts, setPosts] = useState<PostItem[]>([]);
	const [tab, setTab] = useState<"profile" | "schedule" | "feedback">("profile");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FeedbackValues>({
		resolver: zodResolver(feedbackSchema),
		mode: "onTouched",
		defaultValues: { score: 3, strengths: "", improvements: "" },
	});

	useEffect(() => {
		let ignore = false;
		async function load() {
			try {
				setLoading(true);
				const [u, t, p] = await Promise.all([
					api.get<UserDetail>(`/users/${id}`),
					api.get<{ todos: TodoItem[] }>(`/todos`, { params: { userId: id } }),
					api.get<{ posts: PostItem[] }>(`/posts`, { params: { userId: id } }),
				]);
				if (!ignore) {
					setUser(u.data);
					setTodos(t.data.todos || []);
					setPosts(p.data.posts || []);
				}
			} catch {
				setError("Failed to load candidate details");
			} finally {
				setLoading(false);
			}
		}
		if (Number.isFinite(id)) load();
		return () => {
			ignore = true;
		};
	}, [id]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const hash = window.location.hash.replace("#", "");
			if (hash === "feedback" || hash === "schedule" || hash === "profile") setTab(hash as any);
		}
	}, []);

	async function onSubmit(values: FeedbackValues) {
		await new Promise((r) => setTimeout(r, 700));
		alert("Feedback submitted (simulated). Thank you!");
		reset();
	}

	const fullName = useMemo(() => (user ? `${user.firstName} ${user.lastName}` : ""), [user]);

	return (
		<>
				{loading && <p>Loading...</p>}
				{error && <p className="text-red-600 text-sm">{error}</p>}

				{!loading && user && (
					<div className="space-y-4">
						<div className="flex gap-2">
							<button className={`btn-outline ${tab === "profile" ? "bg-neutral-100" : ""}`} onClick={() => setTab("profile")}>Profile</button>
							<button className={`btn-outline ${tab === "schedule" ? "bg-neutral-100" : ""}`} onClick={() => setTab("schedule")}>Schedule</button>
							<button className={`btn-outline ${tab === "feedback" ? "bg-neutral-100" : ""}`} onClick={() => setTab("feedback")}>Feedback</button>
						</div>

						{tab === "profile" && (
							<div className="space-y-2">
								<p className="text-lg font-medium">{fullName}</p>
								<p className="text-sm text-neutral-600">{user.email} • {user.username}</p>
								<p className="text-sm">Department: {user.company?.department || "-"}</p>
							</div>
						)}

						{tab === "schedule" && (
							<div className="space-y-2">
								{todos.length === 0 && <p className="text-sm text-neutral-600">No scheduled items.</p>}
								<ul className="list-disc pl-5 space-y-1">
									{todos.map((t) => (
										<li key={t.id} className="text-sm">
											<span className={t.completed ? "line-through" : ""}>{t.todo}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{tab === "feedback" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2 card">
									<p className="font-medium">Existing Feedback</p>
									{posts.length === 0 && <p className="text-sm text-neutral-600">No feedback yet.</p>}
									<ul className="space-y-2">
										{posts.map((p) => (
											<li key={p.id} className="border rounded p-3">
												<p className="text-sm font-medium">{p.title}</p>
												<p className="text-sm text-neutral-700">{p.body}</p>
											</li>
										))}
									</ul>
								</div>
								<div className="card">
									<RoleGate allow={["panelist"]}>
										<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
											<p className="font-medium">Submit Feedback</p>
											<div>
												<label className="text-sm">Overall Score (1-5)</label>
											<input type="number" min={1} max={5} step={1} className="input" {...register("score", { valueAsNumber: true })} />
												{errors.score && <p className="text-xs text-red-600">{errors.score.message}</p>}
											</div>
											<div>
												<label className="text-sm">Strengths</label>
											<textarea className="input" rows={3} {...register("strengths")} />
												{errors.strengths && <p className="text-xs text-red-600">{errors.strengths.message}</p>}
											</div>
											<div>
												<label className="text-sm">Areas for Improvement</label>
											<textarea className="input" rows={3} {...register("improvements")} />
												{errors.improvements && <p className="text-xs text-red-600">{errors.improvements.message}</p>}
											</div>
											<button type="submit" disabled={isSubmitting} className="btn-primary">
												{isSubmitting ? "Submitting..." : "Submit Feedback"}
											</button>
										</form>
									</RoleGate>
								</div>
							</div>
						)}
					</div>
				)}
		</>
	);
}

export default function CandidateDetailPage() {
	const params = useParams<{ id: string }>();
	const id = Number(params?.id);
	return (
		<Protected>
			<DashboardShell title="Candidate Details">
				<Suspense fallback={<div className="card">Loading candidate...</div>}>
					<DetailContent id={id} />
				</Suspense>
			</DashboardShell>
		</Protected>
	);
}


