import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/theme/colors';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

function RootLayoutNav() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(app)';

        if (!user && inAuthGroup) {
            router.replace('/login');
        } else if (user && !inAuthGroup) {
            router.replace('/(app)/scanner');
        }
    }, [user, segments, isLoading]);

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.dark.background } }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="(app)" />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
