export type UserRole = 'ADMIN' | 'SECURITY' | 'PARENT_STUDENT';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    institutionId: string;
}

export interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}
