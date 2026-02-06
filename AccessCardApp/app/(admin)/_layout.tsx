import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.dark.card,
                    borderTopColor: Colors.dark.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: Colors.dark.primary,
                tabBarInactiveTintColor: Colors.dark.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                },
                tabBarIconStyle: {
                    marginBottom: 2,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="grid-outline" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="students"
                options={{
                    title: 'Students',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="people-outline" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="staff"
                options={{
                    title: 'Staff',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="shield-checkmark-outline" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="guardians"
                options={{
                    title: 'Guardians',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-add-outline" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
