import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents, mockStaff, mockRecentActivity } from '@/data/mockData';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const router = useRouter();

    const activeStaff = mockStaff.filter(s => s.status === 'active').length;
    const todayPickups = mockRecentActivity.filter(a => {
        const today = new Date();
        return a.timestamp.toDateString() === today.toDateString();
    }).length;

    const stats = [
        {
            title: 'Total Students',
            value: mockStudents.length.toString(),
            icon: 'people' as const,
            color: Colors.dark.primary,
            bgColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
            title: 'Pickups Today',
            value: todayPickups.toString(),
            icon: 'checkmark-circle' as const,
            color: Colors.dark.approved,
            bgColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
            title: 'Active Staff',
            value: activeStaff.toString(),
            icon: 'shield-checkmark' as const,
            color: Colors.dark.secondary,
            bgColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
            title: 'Pending Approvals',
            value: '0',
            icon: 'time' as const,
            color: Colors.dark.warning,
            bgColor: 'rgba(251, 146, 60, 0.1)',
        },
    ];

    const quickActions = [
        {
            title: 'Add Student',
            icon: 'person-add' as const,
            color: Colors.dark.primary,
            onPress: () => router.push('/(admin)/students'),
        },
        {
            title: 'Add Staff',
            icon: 'shield-checkmark' as const,
            color: Colors.dark.secondary,
            onPress: () => router.push('/(admin)/staff'),
        },
        {
            title: 'View Reports',
            icon: 'stats-chart' as const,
            color: Colors.dark.warning,
            onPress: () => { },
        },
        {
            title: 'Settings',
            icon: 'settings' as const,
            color: Colors.dark.textSecondary,
            onPress: () => router.push('/(admin)/settings'),
        },
    ];

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <Screen style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back! 👋</Text>
                        <Text style={styles.subtitle}>AccessCard Admin Dashboard</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                                <Ionicons name={stat.icon} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionCard}
                                onPress={action.onPress}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                                    <Ionicons name={action.icon} size={24} color={action.color} />
                                </View>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        {mockRecentActivity.slice(0, 5).map((activity) => (
                            <View key={activity.id} style={styles.activityItem}>
                                <View
                                    style={[
                                        styles.activityDot,
                                        {
                                            backgroundColor:
                                                activity.status === 'approved'
                                                    ? Colors.dark.approved
                                                    : Colors.dark.denied,
                                        },
                                    ]}
                                />
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>
                                        {activity.status === 'approved' ? 'Pickup Approved' : 'Pickup Denied'}
                                    </Text>
                                    <Text style={styles.activityDetails}>
                                        {activity.studentName} • {activity.guardianName}
                                    </Text>
                                    {activity.staffName && (
                                        <Text style={styles.activityStaff}>By {activity.staffName}</Text>
                                    )}
                                </View>
                                <Text style={styles.activityTime}>{formatTimeAgo(activity.timestamp)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 12,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.dark.text,
        textAlign: 'center',
    },
    activityCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    activityDetails: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginBottom: 2,
    },
    activityStaff: {
        fontSize: 11,
        color: Colors.dark.textTertiary,
    },
    activityTime: {
        fontSize: 11,
        color: Colors.dark.textSecondary,
        marginTop: 6,
    },
});
