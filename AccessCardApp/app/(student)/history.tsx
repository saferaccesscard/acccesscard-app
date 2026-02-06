import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

type PickupStatus = 'approved' | 'completed' | 'delayed';

interface HistoryItem {
    id: string;
    status: PickupStatus;
    title: string;
    date: string;
    time: string;
    gate: string;
    guardian: string;
}

const mockHistory: HistoryItem[] = [
    {
        id: '1',
        status: 'approved',
        title: 'Pickup Approved',
        date: 'Nov 20, 2024',
        time: '3:20 PM',
        gate: 'Main Gate A',
        guardian: 'Sarah Johnson',
    },
    {
        id: '2',
        status: 'completed',
        title: 'Pickup Completed',
        date: 'Nov 19, 2024',
        time: '3:30 PM',
        gate: 'Main Gate A',
        guardian: 'Sarah Johnson',
    },
    {
        id: '3',
        status: 'delayed',
        title: 'Pickup Delayed',
        date: 'Nov 18, 2024',
        time: '3:40 PM',
        gate: 'Side Gate B',
        guardian: 'Michael Johnson',
    },
    {
        id: '4',
        status: 'completed',
        title: 'Pickup Completed',
        date: 'Nov 17, 2024',
        time: '3:25 PM',
        gate: 'Main Gate A',
        guardian: 'Sarah Johnson',
    },
];

const getStatusColor = (status: PickupStatus) => {
    switch (status) {
        case 'approved':
            return Colors.dark.completed;
        case 'completed':
            return Colors.dark.approved;
        case 'delayed':
            return Colors.dark.delayed;
        default:
            return Colors.dark.textSecondary;
    }
};

export default function HistoryScreen() {
    const [filter, setFilter] = useState<'week' | 'month' | 'all'>('week');

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pickup History</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'week' && styles.filterButtonActive]}
                        onPress={() => setFilter('week')}
                    >
                        <Ionicons name="calendar-outline" size={14} color={Colors.dark.primary} />
                        <Text style={styles.filterText}>This Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.exportButton}>
                        <Ionicons name="download-outline" size={14} color="white" />
                        <Text style={styles.exportText}>Export</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {mockHistory.map((item, index) => (
                    <View key={item.id} style={styles.timelineItem}>
                        <View style={styles.timelineLine}>
                            <View
                                style={[
                                    styles.timelineDot,
                                    { backgroundColor: getStatusColor(item.status) },
                                ]}
                            />
                            {index < mockHistory.length - 1 && <View style={styles.timelineConnector} />}
                        </View>

                        <View style={styles.historyCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardTime}>{item.time}</Text>
                            </View>
                            <Text style={styles.cardDate}>{item.date}</Text>
                            <View style={styles.cardDetails}>
                                <Text style={styles.cardDetail}>{item.gate}</Text>
                                <Text style={styles.cardDetailSeparator}>•</Text>
                                <Text style={styles.cardDetail}>{item.guardian}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        padding: 0,
    },
    header: {
        padding: 16,
        paddingBottom: 12,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.dark.card,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    filterButtonActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: Colors.dark.primary,
    },
    filterText: {
        color: Colors.dark.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    exportText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingTop: 0,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    timelineLine: {
        width: 20,
        alignItems: 'center',
        marginRight: 12,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 16,
    },
    timelineConnector: {
        width: 2,
        flex: 1,
        backgroundColor: Colors.dark.border,
        marginTop: 6,
    },
    historyCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
    },
    cardTime: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    cardDate: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginBottom: 6,
    },
    cardDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardDetail: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
    },
    cardDetailSeparator: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
    },
});
