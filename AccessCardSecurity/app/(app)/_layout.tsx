import { Stack } from 'expo-router';
import { Colors } from '@/theme/colors';

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.dark.background } }}>
            <Stack.Screen name="scanner" />
        </Stack>
    );
}
