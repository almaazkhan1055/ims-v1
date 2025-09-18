"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	return (
		<div className="flex items-center gap-2">
			<select
				aria-label="Theme"
				className="input py-1 px-2 h-8"
				value={theme}
				onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="system">System</option>
			</select>
		</div>
	);
}


