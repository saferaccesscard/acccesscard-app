import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';

interface AddStudentModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (student: any) => void;
}

export function AddStudentModal({ visible, onClose, onAdd }: AddStudentModalProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [grade, setGrade] = useState('');
    const [classSection, setClassSection] = useState('');
    const [rollNumber, setRollNumber] = useState('');

    const handleSubmit = () => {
        // Validation
        if (!firstName || !lastName || !grade || !classSection || !rollNumber) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newStudent = {
            id: Math.random().toString(36).substring(2, 15),
            firstName,
            lastName,
            grade,
            class: classSection,
            rollNumber,
            photoUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            guardians: [],
            qrCode: `PICKUP-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        onAdd(newStudent);

        // Reset form
        setFirstName('');
        setLastName('');
        setGrade('');
        setClassSection('');
        setRollNumber('');

        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Student</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>First Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter first name"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Last Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter last name"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Grade *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., 5"
                                    placeholderTextColor={Colors.dark.textSecondary}
                                    value={grade}
                                    onChangeText={setGrade}
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Class *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., A"
                                    placeholderTextColor={Colors.dark.textSecondary}
                                    value={classSection}
                                    onChangeText={setClassSection}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Roll Number *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., 2024-A-145"
                                placeholderTextColor={Colors.dark.textSecondary}
                                value={rollNumber}
                                onChangeText={setRollNumber}
                            />
                        </View>

                        <Text style={styles.note}>
                            * Required fields. Guardians can be added after creating the student.
                        </Text>
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add Student</Text>
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
    row: {
        flexDirection: 'row',
    },
    note: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        fontStyle: 'italic',
        marginTop: 8,
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
        backgroundColor: Colors.dark.primary,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
