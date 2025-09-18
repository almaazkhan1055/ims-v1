export type UserRole = "admin" | "ta_member" | "panelist";

export interface User {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
}

export interface AuthSession {
    token: string;
    role: UserRole;
    user: User;
}