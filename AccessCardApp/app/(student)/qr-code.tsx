import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useQR } from '@/context/QRContext';

export default function QRCodeScreen() {
    const { currentQRCode, generateQRCode } = useQR();
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if (!currentQRCode) return;

        const updateTimer = () => {
            const now = new Date();
            const remaining = Math.max(0, Math.floor((currentQRCode.expiresAt.getTime() - now.getTime()) / 1000));
            setTimeRemaining(remaining);

            if (remaining === 0) {
                // Generate new QR code when expired
                generateQRCode();
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [currentQRCode]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCountdown = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentQRCode) {
        return (
            <Screen style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Generating QR Code...</Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header with Timer */}
                <View style={styles.header}>
                    <View style={styles.timerBadge}>
                        <Ionicons name="time-outline" size={14} color={Colors.dark.warning} />
                        <Text style={styles.timerText}>{formatCountdown(timeRemaining)}</Text>
                    </View>
                </View>

                <Text style={styles.instruction}>Show this QR code at pickup gate</Text>

                {/* Expiration Notice */}
                <View style={styles.expirationBadge}>
                    <Ionicons name="hourglass-outline" size={12} color={Colors.dark.primary} />
                    <Text style={styles.expirationText}>Expires in {formatTime(timeRemaining)}</Text>
                </View>

                {/* Student Avatar */}
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>👧🏻</Text>
                </View>

                {/* Student Info */}
                <Text style={styles.studentName}>{currentQRCode.studentName}</Text>
                <Text style={styles.studentGrade}>Grade 3 • Mrs. Anderson</Text>

                {/* QR Code */}
                <View style={styles.qrContainer}>
                    <QRCode
                        value={currentQRCode.token}
                        size={200}
                        backgroundColor="white"
                        color="black"
                    />
                </View>

                {/* Pickup Details */}
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={18} color={Colors.dark.primary} />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Pickup Time</Text>
                            <Text style={styles.detailValue}>3:30 PM</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={18} color={Colors.dark.primary} />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Gate</Text>
                            <Text style={styles.detailValue}>{currentQRCode.gate}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="person-outline" size={18} color={Colors.dark.primary} />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Guardian</Text>
                            <Text style={styles.detailValue}>{currentQRCode.guardianName}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="key-outline" size={18} color={Colors.dark.primary} />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>QR Token</Text>
                            <Text style={styles.detailValue}>{currentQRCode.token.substring(0, 12)}...</Text>
                        </View>
                    </View>
                </View>

                <Button
                    title="Refresh QR Code"
                    onPress={generateQRCode}
                    variant="outline"
                    style={styles.refreshButton}
                    icon={<Ionicons name="refresh-outline" size={20} color={Colors.dark.primary} />}
                />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        padding: 0,
    },
    scrollContent: {
        padding: 16,
        alignItems: 'center',
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.dark.text,
        fontSize: 16,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    timerText: {
        color: Colors.dark.warning,
        fontSize: 12,
        fontWeight: '600',
    },
    instruction: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    },
    expirationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 20,
    },
    expirationText: {
        color: Colors.dark.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        fontSize: 56,
    },
    studentName: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    studentGrade: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginBottom: 24,
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
        marginBottom: 2,
    },
    detailValue: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    refreshButton: {
        width: '100%',
    },
});
