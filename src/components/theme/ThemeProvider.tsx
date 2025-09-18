"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemDark() {
	if (typeof window === "undefined") return false;
	return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return "system";
		return (localStorage.getItem("imsapp:theme") as Theme) || "system";
	});

	useEffect(() => {
		localStorage.setItem("imsapp:theme", theme);
		const root = document.documentElement;
		const useDark = theme === "dark" || (theme === "system" && getSystemDark());
		root.classList.toggle("dark", useDark);
		root.setAttribute("data-theme", useDark ? "dark" : "light");
	}, [theme]);

	const value = useMemo(() => ({ theme, setTheme }), [theme]);
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}


