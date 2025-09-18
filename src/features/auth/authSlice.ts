import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "ta_member" | "panelist";

export interface AuthUser {
	id: number;
	username: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	image?: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	accessToken?: string;
	role?: UserRole;
	user?: AuthUser;
}

const initialState: AuthState = {
	isAuthenticated: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSucceeded(
			state,
			action: PayloadAction<{ accessToken: string; role: UserRole; user: AuthUser }>
		) {
			state.isAuthenticated = true;
			state.accessToken = action.payload.accessToken;
			state.role = action.payload.role;
			state.user = action.payload.user;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.accessToken = undefined;
			state.role = undefined;
			state.user = undefined;
		},
		bootstrapSession(state, action: PayloadAction<AuthState>) {
			return { ...state, ...action.payload };
		},
	},
});

export const { loginSucceeded, logout, bootstrapSession } = authSlice.actions;
export default authSlice.reducer;


