import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useQR } from '@/context/QRContext';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Relationship = 'Mother' | 'Father' | 'Grandparent' | 'Other';

export default function StudentHome() {
    const { signOut, user } = useAuth();
    const { pickupLogs } = useQR();
    const router = useRouter();
    const [showGuardianModal, setShowGuardianModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        relationship: 'Mother' as Relationship,
        phoneNumber: '',
        email: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const relationships: Relationship[] = ['Mother', 'Father', 'Grandparent', 'Other'];

    const handleShowVirtualID = () => {
        router.push('/(student)/qr-code');
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitGuardian = () => {
        if (validateForm()) {
            Alert.alert(
                'Success',
                `Guardian ${formData.fullName} has been added successfully!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setShowGuardianModal(false);
                            setFormData({
                                fullName: '',
                                relationship: 'Mother',
                                phoneNumber: '',
                                email: '',
                            });
                            setErrors({});
                        },
                    },
                ]
            );
        }
    };

    return (
        <Screen style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Greeting */}
                <View style={styles.greeting}>
                    <Text style={styles.greetingText}>Hi, Parent 👋</Text>
                    <Text style={styles.welcomeText}>Welcome back!</Text>
                </View>

                {/* Student Card */}
                <View style={styles.studentCard}>
                    <View style={styles.studentInfo}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=25' }}
                            style={styles.studentImage}
                            contentFit="cover"
                            transition={200}
                        />
                        <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>Emma Johnson</Text>
                            <View style={styles.studentMeta}>
                                <Text style={styles.studentGrade}>Grade 3</Text>
                                <Text style={styles.metaSeparator}>•</Text>
                                <Text style={styles.studentTeacher}>Mrs. Anderson</Text>
                            </View>
                            <Text style={styles.rollNumber}>Roll No: 2024-A-145</Text>
                        </View>
                    </View>
                </View>

                {/* Today's Pickup Card */}
                <View style={styles.pickupCard}>
                    <View style={styles.pickupHeader}>
                        <Text style={styles.pickupTitle}>Today's Pickup</Text>
                        <View style={styles.approvedBadge}>
                            <Text style={styles.approvedText}>Approved</Text>
                        </View>
                    </View>
                    <Text style={styles.pickupTime}>Expected: 3:30 PM</Text>

                    <View style={styles.pickupDetails}>
                        <View style={styles.detailRow}>
                            <Ionicons name="location-outline" size={18} color={Colors.dark.primary} />
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Location</Text>
                                <Text style={styles.detailValue}>Main Gate A</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="person-outline" size={18} color={Colors.dark.primary} />
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Guardian</Text>
                                <Text style={styles.detailValue}>Sarah Johnson (Mother)</Text>
                            </View>
                        </View>
                    </View>

                    <Button
                        title="Show Virtual ID"
                        onPress={handleShowVirtualID}
                        style={styles.virtualIdButton}
                        icon={<Ionicons name="qr-code-outline" size={20} color="white" />}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => setShowGuardianModal(true)}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="person-add" size={24} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.actionTitle}>Add Guardian</Text>
                        <Text style={styles.actionSubtitle}>Alternate pickup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionIconGreen}>
                            <Ionicons name="bus" size={24} color={Colors.dark.secondary} />
                        </View>
                        <Text style={styles.actionTitle}>Track Bus</Text>
                        <Text style={styles.actionSubtitle}>Live tracking</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>

                    {pickupLogs.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={32} color={Colors.dark.textTertiary} />
                            <Text style={styles.emptyText}>No recent activity</Text>
                        </View>
                    ) : (
                        pickupLogs.slice(0, 5).map((log) => (
                            <View key={log.id} style={styles.activityItem}>
                                <View
                                    style={[
                                        styles.activityDot,
                                        {
                                            backgroundColor:
                                                log.status === 'approved'
                                                    ? Colors.dark.approved
                                                    : Colors.dark.denied,
                                        },
                                    ]}
                                />
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>
                                        {log.status === 'approved' ? 'Pickup Approved' : 'Pickup Denied'}
                                    </Text>
                                    <Text style={styles.activityDate}>
                                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                </View>
                                <Text style={styles.activityTime}>
                                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Guardian Modal */}
            <Modal
                visible={showGuardianModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowGuardianModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowGuardianModal(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Guardian</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalSubtitle}>
                            Add an authorized guardian for pickup
                        </Text>

                        {/* Full Name */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={[styles.input, errors.fullName && styles.inputError]}
                                placeholder="Enter full name"
                                placeholderTextColor={Colors.dark.textTertiary}
                                value={formData.fullName}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, fullName: text });
                                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                                }}
                            />
                            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                        </View>

                        {/* Relationship */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Relationship *</Text>
                            <View style={styles.relationshipButtons}>
                                {relationships.map((rel) => (
                                    <TouchableOpacity
                                        key={rel}
                                        style={[
                                            styles.relationshipButton,
                                            formData.relationship === rel && styles.relationshipButtonActive,
                                        ]}
                                        onPress={() => setFormData({ ...formData, relationship: rel })}
                                    >
                                        <Text
                                            style={[
                                                styles.relationshipButtonText,
                                                formData.relationship === rel && styles.relationshipButtonTextActive,
                                            ]}
                                        >
                                            {rel}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Phone Number */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone Number *</Text>
                            <TextInput
                                style={[styles.input, errors.phoneNumber && styles.inputError]}
                                placeholder="Enter phone number"
                                placeholderTextColor={Colors.dark.textTertiary}
                                value={formData.phoneNumber}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, phoneNumber: text });
                                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                                }}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
                        </View>

                        {/* Email */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email (Optional)</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="Enter email address"
                                placeholderTextColor={Colors.dark.textTertiary}
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, email: text });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        <Button
                            title="Add Guardian"
                            onPress={handleSubmitGuardian}
                            style={styles.submitButton}
                            icon={<Ionicons name="checkmark-circle-outline" size={20} color="white" />}
                        />
                    </ScrollView>
                </View>
            </Modal>
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
        paddingBottom: 32,
    },
    greeting: {
        marginBottom: 16,
    },
    greetingText: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    welcomeText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    studentCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    studentImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.dark.surface,
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    studentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    studentGrade: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
    },
    metaSeparator: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        marginHorizontal: 4,
    },
    studentTeacher: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
    },
    rollNumber: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
    },
    pickupCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    pickupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    pickupTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
    approvedBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    approvedText: {
        color: Colors.dark.approved,
        fontSize: 11,
        fontWeight: '600',
    },
    pickupTime: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        marginBottom: 12,
    },
    pickupDetails: {
        gap: 8,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
        marginBottom: 1,
    },
    detailValue: {
        color: Colors.dark.text,
        fontSize: 13,
        fontWeight: '500',
    },
    virtualIdButton: {
        marginTop: 4,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionIconGreen: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'center',
    },
    actionSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
        textAlign: 'center',
    },
    activitySection: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    activityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    activityDate: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    activityTime: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.dark.card,
        borderRadius: 10,
    },
    emptyText: {
        color: Colors.dark.textTertiary,
        fontSize: 13,
        marginTop: 8,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: 16,
        paddingBottom: 32,
    },
    modalSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.dark.card,
        borderRadius: 10,
        padding: 12,
        color: Colors.dark.text,
        fontSize: 14,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    inputError: {
        borderColor: Colors.dark.danger,
    },
    errorText: {
        color: Colors.dark.danger,
        fontSize: 11,
        marginTop: 4,
    },
    relationshipButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    relationshipButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Colors.dark.card,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    relationshipButtonActive: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: Colors.dark.primary,
    },
    relationshipButtonText: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    relationshipButtonTextActive: {
        color: Colors.dark.primary,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 8,
    },
});
