import React, { useState } from 'react';
import { Text, StyleSheet, View, Vibration, Modal, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useQR } from '@/context/QRContext';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityScanScreen() {
    const { signOut } = useAuth();
    const { validateQRCode, addPickupLog, pickupLogs } = useQR();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [scanResult, setScanResult] = useState<{
        valid: boolean;
        studentName?: string;
        guardianName?: string;
        gate?: string;
    } | null>(null);

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        Vibration.vibrate();

        const result = validateQRCode(data);

        if (result.valid && result.data) {
            setScanResult({
                valid: true,
                studentName: result.data.studentName,
                guardianName: result.data.guardianName,
                gate: result.data.gate,
            });

            // Add to pickup log as approved
            addPickupLog({
                studentName: result.data.studentName,
                guardianName: result.data.guardianName,
                gate: result.data.gate,
                status: 'approved',
                qrToken: data,
            });
        } else {
            setScanResult({
                valid: false,
            });

            // Add to pickup log as denied
            addPickupLog({
                studentName: 'Unknown',
                guardianName: 'Unknown',
                gate: 'Unknown',
                status: 'denied',
                qrToken: data,
            });
        }

        setShowResult(true);
    };

    const handleCloseResult = () => {
        setShowResult(false);
        setScanResult(null);
        setScanned(false);
    };

    if (hasPermission === null) {
        return (
            <Screen style={styles.container}>
                <Text style={styles.text}>Requesting camera permission...</Text>
            </Screen>
        );
    }

    if (hasPermission === false) {
        return (
            <Screen style={styles.container}>
                <Text style={styles.text}>No access to camera</Text>
                <Button title="Grant Permission" onPress={() => Camera.requestCameraPermissionsAsync()} />
            </Screen>
        );
    }

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Security Scanner</Text>
                <Button title="Logout" onPress={signOut} variant="outline" style={styles.logoutButton} />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <Text style={styles.scanText}>Align QR code within frame</Text>
                </View>
            </View>

            {/* Recent Scans */}
            <View style={styles.logsContainer}>
                <Text style={styles.logsTitle}>Recent Scans ({pickupLogs.length})</Text>
                {pickupLogs.slice(0, 3).map((log) => (
                    <View key={log.id} style={styles.logItem}>
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: log.status === 'approved' ? Colors.dark.approved : Colors.dark.denied },
                            ]}
                        />
                        <View style={styles.logContent}>
                            <Text style={styles.logStudent}>{log.studentName}</Text>
                            <Text style={styles.logDetails}>
                                {log.guardianName} • {log.gate}
                            </Text>
                        </View>
                        <Text style={styles.logTime}>
                            {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Result Modal */}
            <Modal visible={showResult} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.resultCard}>
                        {scanResult?.valid ? (
                            <>
                                <View style={styles.successIcon}>
                                    <Ionicons name="checkmark-circle" size={64} color={Colors.dark.approved} />
                                </View>
                                <Text style={styles.resultTitle}>Access Approved</Text>
                                <Text style={styles.resultSubtitle}>Pickup authorized</Text>

                                <View style={styles.resultDetails}>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Student:</Text>
                                        <Text style={styles.resultValue}>{scanResult.studentName}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Guardian:</Text>
                                        <Text style={styles.resultValue}>{scanResult.guardianName}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Gate:</Text>
                                        <Text style={styles.resultValue}>{scanResult.gate}</Text>
                                    </View>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Time:</Text>
                                        <Text style={styles.resultValue}>
                                            {new Date().toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.errorIcon}>
                                    <Ionicons name="close-circle" size={64} color={Colors.dark.denied} />
                                </View>
                                <Text style={styles.resultTitle}>Access Denied</Text>
                                <Text style={styles.resultSubtitle}>Invalid or expired QR code</Text>
                            </>
                        )}

                        <Button
                            title="Continue Scanning"
                            onPress={handleCloseResult}
                            style={styles.continueButton}
                        />
                    </View>
                </View>
            </Modal>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    logoutButton: {
        height: 36,
        paddingHorizontal: 16,
    },
    text: {
        color: Colors.dark.text,
        fontSize: 16,
        textAlign: 'center',
    },
    cameraContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        height: 400,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: Colors.dark.primary,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    scanText: {
        color: 'white',
        fontSize: 14,
        marginTop: 280,
        textAlign: 'center',
    },
    logsContainer: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
    },
    logsTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    logContent: {
        flex: 1,
    },
    logStudent: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    logDetails: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    logTime: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: 16,
    },
    errorIcon: {
        marginBottom: 16,
    },
    resultTitle: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginBottom: 24,
    },
    resultDetails: {
        width: '100%',
        backgroundColor: Colors.dark.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resultLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    resultValue: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    continueButton: {
        width: '100%',
    },
});
