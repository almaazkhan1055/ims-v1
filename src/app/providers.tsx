"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthBootstrapper } from "@/features/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<ThemeProvider>
				<AuthBootstrapper />
				{children}
			</ThemeProvider>
		</Provider>
	);
}


