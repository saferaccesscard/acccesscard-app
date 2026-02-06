import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, StatusBar } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Colors } from '@/theme/colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents, Student } from '@/data/mockData';

export default function ScannerScreen() {
    const { signOut } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<{
        status: 'success' | 'error';
        student?: Student;
        message?: string;
    } | null>(null);

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.permissionContent}>
                    <Ionicons name="camera-outline" size={64} color={Colors.dark.textSecondary} />
                    <Text style={styles.message}>We need your permission to show the camera</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.button}>
                        <Text style={styles.buttonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
        if (scanned) return;
        setScanned(true);

        // Mock Validation Logic
        // Format expected: "PICKUP-{ID}-{NAME}" - but checking mock data
        const student = mockStudents.find(s => s.qrCode === data);

        if (student) {
            setScanResult({
                status: 'success',
                student: student
            });
        } else {
            setScanResult({
                status: 'error',
                message: 'Invalid QR Code or Student Not Found'
            });
        }
    };

    const handleReset = () => {
        setScanned(false);
        setScanResult(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Scan Student QR</Text>
                        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
                            <Ionicons name="log-out-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.scanArea}>
                        <View style={styles.scanFrame} />
                        <Text style={styles.scanHint}>Align QR code within the frame</Text>
                    </View>
                </View>
            </CameraView>

            {/* Result Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!scanResult}
                onRequestClose={handleReset}
            >
                <View style={styles.modalOverlay}>
                    <View style={[
                        styles.resultCard,
                        scanResult?.status === 'success' ? styles.successBorder : styles.errorBorder
                    ]}>
                        {scanResult?.status === 'success' ? (
                            <>
                                <View style={styles.resultHeader}>
                                    <Ionicons name="checkmark-circle" size={64} color={Colors.dark.success} />
                                    <Text style={styles.resultTitle}>Pickup Approved</Text>
                                </View>

                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>
                                        {scanResult.student?.firstName} {scanResult.student?.lastName}
                                    </Text>
                                    <Text style={styles.studentDetails}>
                                        Grade {scanResult.student?.grade} • Class {scanResult.student?.class}
                                    </Text>
                                </View>

                                <View style={styles.guardiansList}>
                                    <Text style={styles.sectionLabel}>Authorized Guardians:</Text>
                                    {scanResult.student?.guardians.map((g, idx) => (
                                        <View key={idx} style={styles.guardianRow}>
                                            <Ionicons
                                                name={g.approved ? "shield-checkmark" : "warning"}
                                                size={16}
                                                color={g.approved ? Colors.dark.success : Colors.dark.warning}
                                            />
                                            <Text style={styles.guardianName}>{g.name} ({g.relationship})</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.dark.success }]} onPress={handleReset}>
                                    <Text style={styles.actionButtonText}>Complete Pickup</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Ionicons name="alert-circle" size={64} color={Colors.dark.danger} />
                                <Text style={[styles.resultTitle, { color: Colors.dark.danger }]}>Access Denied</Text>
                                <Text style={styles.errorText}>{scanResult?.message}</Text>

                                <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.dark.surface }]} onPress={handleReset}>
                                    <Text style={styles.actionButtonText}>Try Again</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
        marginTop: 20,
        fontSize: 16
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        width: '100%',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8
    },
    scanArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: Colors.dark.primary,
        borderRadius: 20,
        backgroundColor: 'transparent'
    },
    scanHint: {
        marginTop: 20,
        color: 'white',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    resultCard: {
        backgroundColor: Colors.dark.card,
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
    },
    successBorder: {
        borderColor: Colors.dark.success,
    },
    errorBorder: {
        borderColor: Colors.dark.danger,
    },
    resultHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginTop: 8,
    },
    studentInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    studentDetails: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    guardiansList: {
        width: '100%',
        backgroundColor: Colors.dark.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    guardianRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    guardianName: {
        fontSize: 14,
        color: Colors.dark.text,
    },
    errorText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 8,
    },
    actionButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
