import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types/auth';
// import { Amplify } from 'aws-amplify';
// import { getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut } from 'aws-amplify/auth';

// Mock Data for Dev
const MOCK_USERS: Record<string, User> = {
    'admin@school.com': {
        id: 'admin-123',
        email: 'admin@school.com',
        name: 'Principal Skinner',
        role: 'ADMIN',
        institutionId: 'inst-001',
    },
    'security@school.com': {
        id: 'sec-123',
        email: 'security@school.com',
        name: 'Officer Barbrady',
        role: 'SECURITY',
        institutionId: 'inst-001',
    },
    'parent@school.com': {
        id: 'parent-123',
        email: 'parent@school.com',
        name: 'Homer Simpson',
        role: 'PARENT_STUDENT',
        institutionId: 'inst-001',
    },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted session logic here (SecureStore)
        // For now, simple timeout to simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // MOCK AUTH LOGIC
            // In real app: await amplifySignIn({ username: email, password });
            // const currentUser = await getCurrentUser(); ...

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate net delay

            if (MOCK_USERS[email]) {
                setUser(MOCK_USERS[email]);
            } else {
                throw new Error('Invalid credentials (Try admin@school.com)');
            }
        } catch (e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        role: user?.role || null,
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
