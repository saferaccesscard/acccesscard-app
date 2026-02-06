import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { QRProvider } from '@/context/QRContext';
import { UserRole } from '@/types/auth';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to specific role dashboard if authenticated and trying to access auth pages
      redirectUser(user.role);
    } else if (user) {
      // Enforce Role boundaries if user tries to jump groups manually (optional but good)
      // For now, relies on initial redirect.
    }
  }, [user, isLoading, segments]);

  const redirectUser = (role: UserRole) => {
    if (role === 'ADMIN') router.replace('/(admin)/dashboard');
    else if (role === 'SECURITY') router.replace('/(security)/scan');
    else if (role === 'PARENT_STUDENT') router.replace('/(student)/home');
  };

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QRProvider>
        <RootLayoutNav />
      </QRProvider>
    </AuthProvider>
  );
}
