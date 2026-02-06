import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface AddStaffModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (staff: any) => void;
}

export function AddStaffModal({ visible, onClose, onAdd }: AddStaffModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<'security_guard' | 'supervisor'>('security_guard');

    const handleSubmit = () => {
        // Validation
        if (!name || !email || !phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        const newStaff = {
            id: Math.random().toString(36).substring(2, 15),
            name,
            email,
            phone,
            role,
            status: 'active' as const,
            photoUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            createdAt: new Date(),
            lastActive: new Date(),
            totalScans: 0,
            approvedScans: 0,
            deniedScans: 0,
        };

        onAdd(newStaff);

        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setRole('security_guard');

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Staff Member</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter full name"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="email@school.com"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone Number *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+1234567890"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Role *</Text>
                            <View style={styles.roleSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.roleOption,
                                        role === 'security_guard' && styles.roleOptionActive,
                                    ]}
                                    onPress={() => setRole('security_guard')}
                                >
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={24}
                                        color={role === 'security_guard' ? 'white' : Colors.dark.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.roleText,
                                            role === 'security_guard' && styles.roleTextActive,
                                        ]}
                                    >
                                        Security Guard
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.roleOption,
                                        role === 'supervisor' && styles.roleOptionActive,
                                    ]}
                                    onPress={() => setRole('supervisor')}
                                >
                                    <Ionicons
                                        name="person-circle"
                                        size={24}
                                        color={role === 'supervisor' ? 'white' : Colors.dark.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.roleText,
                                            role === 'supervisor' && styles.roleTextActive,
                                        ]}
                                    >
                                        Supervisor
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle" size={20} color={Colors.dark.primary} />
                            <Text style={styles.infoText}>
                                Login credentials will be sent to the provided email address.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add Staff</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.dark.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.dark.background,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.dark.text,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    roleSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    roleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.dark.background,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        gap: 8,
    },
    roleOptionActive: {
        backgroundColor: Colors.dark.secondary,
        borderColor: Colors.dark.secondary,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.textSecondary,
    },
    roleTextActive: {
        color: 'white',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.dark.primary + '15',
        padding: 12,
        borderRadius: 12,
        gap: 8,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: Colors.dark.text,
        lineHeight: 18,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.dark.surface,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    submitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.dark.secondary,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
