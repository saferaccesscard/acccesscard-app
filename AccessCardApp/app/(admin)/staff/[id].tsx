import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStaff, mockRecentActivity } from '@/data/mockData';

export default function StaffDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const staff = mockStaff.find(s => s.id === id);
    const history = mockRecentActivity.filter(activity =>
        staff ? activity.staffName === staff.name : false
    );

    if (!staff) {
        return (
            <Screen style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Staff member not found</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Screen>
        );
    }

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    const successRate = staff.totalScans > 0
        ? Math.round((staff.approvedScans / staff.totalScans) * 100)
        : 0;

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Staff Profile</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="create-outline" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: staff.photoUrl || 'https://i.pravatar.cc/150?img=1' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{staff.name}</Text>
                    <Text style={styles.details}>{staff.email}</Text>
                    <Text style={styles.details}>{staff.phone}</Text>

                    <View style={styles.tagsRow}>
                        <View style={[styles.badge, { backgroundColor: staff.status === 'active' ? Colors.dark.approved + '20' : Colors.dark.textTertiary + '20' }]}>
                            <Text style={[styles.badgeText, { color: staff.status === 'active' ? Colors.dark.approved : Colors.dark.textTertiary }]}>
                                {staff.status.toUpperCase()}
                            </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: Colors.dark.primary + '20' }]}>
                            <Text style={[styles.badgeText, { color: Colors.dark.primary }]}>
                                {staff.role === 'security_guard' ? 'SECURITY GUARD' : 'SUPERVISOR'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{staff.totalScans}</Text>
                        <Text style={styles.statLabel}>Total Scans</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: Colors.dark.approved }]}>{successRate}%</Text>
                        <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: Colors.dark.denied }]}>{staff.deniedScans}</Text>
                        <Text style={styles.statLabel}>Denied</Text>
                    </View>
                </View>

                {/* Activity Log Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Activity Log</Text>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <View key={item.id} style={styles.historyItem}>
                                <View style={[styles.historyDot, { backgroundColor: item.status === 'approved' ? Colors.dark.approved : Colors.dark.denied }]} />
                                <View style={styles.historyContent}>
                                    <Text style={styles.historyStatus}>
                                        {item.status === 'approved' ? 'Allowed Entry' : 'Denied Entry'}
                                    </Text>
                                    <Text style={styles.historyGuardian}>{item.studentName} retrieved by {item.guardianName}</Text>
                                    <Text style={styles.historyStaff}>{item.gate}</Text>
                                </View>
                                <Text style={styles.historyTime}>{formatTimeAgo(item.timestamp)}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No recent activity</Text>
                    )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    headerButton: {
        padding: 8,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.dark.text,
        marginBottom: 16,
    },
    backButton: {
        padding: 10,
        backgroundColor: Colors.dark.primary,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profileCard: {
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 4,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 16,
    },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    historyDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        marginRight: 12,
    },
    historyContent: {
        flex: 1,
    },
    historyStatus: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 2,
    },
    historyGuardian: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginBottom: 2,
    },
    historyStaff: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
    },
    historyTime: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontStyle: 'italic',
    },
});
