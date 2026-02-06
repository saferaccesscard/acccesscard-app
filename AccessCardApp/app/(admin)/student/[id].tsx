import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents, mockRecentActivity } from '@/data/mockData';

export default function StudentDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const student = mockStudents.find(s => s.id === id);
    const history = mockRecentActivity.filter(activity =>
        student ? activity.studentName === `${student.firstName} ${student.lastName}` : false
    );

    if (!student) {
        return (
            <Screen style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>Student not found</Text>
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

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Profile</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="create-outline" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: student.photoUrl || 'https://i.pravatar.cc/150?img=1' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{student.firstName} {student.lastName}</Text>
                    <Text style={styles.details}>
                        Grade {student.grade} • Class {student.class}
                    </Text>
                    <View style={styles.rollContainer}>
                        <Text style={styles.rollLabel}>Roll No:</Text>
                        <Text style={styles.rollValue}>{student.rollNumber}</Text>
                    </View>
                </View>

                {/* Guardians Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guardians</Text>
                    {student.guardians.map((guardian) => (
                        <View key={guardian.id} style={styles.guardianCard}>
                            <View style={styles.guardianHeader}>
                                <Ionicons name="person-circle" size={40} color={Colors.dark.textSecondary} />
                                <View style={styles.guardianInfo}>
                                    <Text style={styles.guardianName}>{guardian.name}</Text>
                                    <Text style={styles.guardianRelation}>{guardian.relationship}</Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: guardian.approved ? Colors.dark.approved + '20' : Colors.dark.warning + '20' }]}>
                                    <Text style={[styles.badgeText, { color: guardian.approved ? Colors.dark.approved : Colors.dark.warning }]}>
                                        {guardian.approved ? 'Approved' : 'Pending'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.contactRow}>
                                <Ionicons name="call-outline" size={16} color={Colors.dark.textSecondary} />
                                <Text style={styles.contactText}>{guardian.phone}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pickup History Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <View key={item.id} style={styles.historyItem}>
                                <View style={[styles.historyDot, { backgroundColor: item.status === 'approved' ? Colors.dark.approved : Colors.dark.denied }]} />
                                <View style={styles.historyContent}>
                                    <Text style={styles.historyStatus}>
                                        {item.status === 'approved' ? 'Pickup Approved' : 'Pickup Denied'}
                                    </Text>
                                    <Text style={styles.historyGuardian}>Picked up by {item.guardianName}</Text>
                                    {item.staffName && <Text style={styles.historyStaff}>Verified by {item.staffName}</Text>}
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
        marginBottom: 8,
    },
    details: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        marginBottom: 16,
    },
    rollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    rollLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginRight: 8,
    },
    rollValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.dark.text,
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
    guardianCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    guardianHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    guardianInfo: {
        flex: 1,
        marginLeft: 12,
    },
    guardianName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    guardianRelation: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
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
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 52,
    },
    contactText: {
        marginLeft: 8,
        color: Colors.dark.textSecondary,
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
