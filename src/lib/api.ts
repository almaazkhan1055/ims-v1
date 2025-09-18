import axios from "axios";

export const api = axios.create({
	baseURL: "https://dummyjson.com",
	headers: {
		"Content-Type": "application/json",
	},
});

export interface LoginRequestBody {
	username: string;
	password: string;
}

export interface LoginResponse {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	image: string;
	// Optional: some environments might not return token
	token?: string;
}

export async function login(body: LoginRequestBody): Promise<LoginResponse> {
	const { data } = await api.post<LoginResponse>("/auth/login", body);
	return data;
}


