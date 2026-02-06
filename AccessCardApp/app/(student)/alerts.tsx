import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

type NotificationType = 'pickup' | 'bus' | 'guardian' | 'alert' | 'system';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    isNew: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'pickup',
        title: 'Pickup Approved',
        message: 'Your pickup for Emma has been approved for 3:30 PM today.',
        time: '10:12 AM',
        isNew: true,
    },
    {
        id: '2',
        type: 'bus',
        title: 'Bus En Route',
        message: 'Bus #10 has left school and is 5 minutes away from your stop.',
        time: '3:10 PM',
        isNew: true,
    },
    {
        id: '3',
        type: 'guardian',
        title: 'Alternate Guardian Approved',
        message: 'Michael Johnson is approved to pick up Emma today.',
        time: '9:45 AM',
        isNew: true,
    },
    {
        id: '4',
        type: 'alert',
        title: 'School Safety Alert',
        message: 'Due to heavy rain, pickup will be delayed by 20 minutes.',
        time: '2:50 PM',
        isNew: false,
    },
    {
        id: '5',
        type: 'system',
        title: 'System Update',
        message: 'New security patch has been applied for safer check-ins.',
        time: 'Yesterday',
        isNew: false,
    },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'pickup':
            return { name: 'car' as const, color: Colors.dark.iconBlue };
        case 'bus':
            return { name: 'bus' as const, color: Colors.dark.iconGreen };
        case 'guardian':
            return { name: 'people' as const, color: Colors.dark.iconPurple };
        case 'alert':
            return { name: 'warning' as const, color: Colors.dark.iconOrange };
        case 'system':
            return { name: 'settings' as const, color: Colors.dark.iconGray };
        default:
            return { name: 'notifications' as const, color: Colors.dark.iconGray };
    }
};

export default function AlertsScreen() {
    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {mockNotifications.map((notification) => {
                    const icon = getNotificationIcon(notification.type);
                    return (
                        <View key={notification.id} style={styles.notificationCard}>
                            <View style={[styles.iconContainer, { backgroundColor: `${icon.color}33` }]}>
                                <Ionicons name={icon.name} size={20} color={icon.color} />
                            </View>

                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                                    {notification.isNew && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newBadgeText}>New</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.notificationMessage}>{notification.message}</Text>
                                <Text style={styles.notificationTime}>{notification.time}</Text>
                            </View>
                        </View>
                    );
                })}
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
    },
    scrollContent: {
        padding: 16,
        paddingTop: 0,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    newBadge: {
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    notificationMessage: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 4,
    },
    notificationTime: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
    },
});
