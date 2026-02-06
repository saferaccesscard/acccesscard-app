import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffMember, mockStaff } from '../data/mockData';

interface AuthContextType {
    user: StaffMember | null;
    signIn: (email: string) => Promise<boolean>;
    signOut: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => false,
    signOut: () => { },
    isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<StaffMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate persistent login check
    useEffect(() => {
        // In a real app, check AsyncStorage here
    }, []);

    const signIn = async (email: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const staff = mockStaff.find(s => s.email.toLowerCase() === email.toLowerCase());

        if (staff) {
            setUser(staff);
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
