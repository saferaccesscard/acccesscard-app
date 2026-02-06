import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

export default function StudentLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.dark.primary,
                tabBarInactiveTintColor: Colors.dark.textSecondary,
                tabBarStyle: {
                    backgroundColor: Colors.dark.surface,
                    borderTopColor: Colors.dark.border,
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: Colors.dark.background,
                },
                headerTintColor: Colors.dark.text,
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications" size={size} color={color} />
                    ),
                    tabBarBadge: 3,
                }}
            />
            <Tabs.Screen
                name="qr-code"
                options={{
                    title: 'QR Code',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="qr-code" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
