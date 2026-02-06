import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PickupLog {
    id: string;
    studentName: string;
    guardianName: string;
    gate: string;
    timestamp: Date;
    status: 'approved' | 'denied';
    qrToken: string;
}

interface QRCodeData {
    token: string;
    studentId: string;
    studentName: string;
    guardianName: string;
    gate: string;
    expiresAt: Date;
    isValid: boolean;
}

interface QRContextType {
    currentQRCode: QRCodeData | null;
    generateQRCode: () => void;
    validateQRCode: (token: string) => { valid: boolean; data?: QRCodeData };
    pickupLogs: PickupLog[];
    addPickupLog: (log: Omit<PickupLog, 'id' | 'timestamp'>) => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);
const QR_STORAGE_KEY = '@accesscard_qr_code';

export function QRProvider({ children }: { children: React.ReactNode }) {
    const [currentQRCode, setCurrentQRCode] = useState<QRCodeData | null>(null);
    const [pickupLogs, setPickupLogs] = useState<PickupLog[]>([]);
    const hasInitialized = useRef(false);

    const generateQRCode = async () => {
        // Generate a unique token with timestamp for uniqueness
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        const token = `PICKUP-${timestamp}-${random}`;

        // Set expiration to 15 minutes from now
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const qrData: QRCodeData = {
            token,
            studentId: '2024-A-145',
            studentName: 'Emma Johnson',
            guardianName: 'Sarah Johnson',
            gate: 'Main Gate A',
            expiresAt,
            isValid: true,
        };

        console.log('🔵 Generated new QR code:', token);
        setCurrentQRCode(qrData);

        // Save to AsyncStorage
        try {
            await AsyncStorage.setItem(QR_STORAGE_KEY, JSON.stringify({
                ...qrData,
                expiresAt: qrData.expiresAt.toISOString(),
            }));
        } catch (error) {
            console.error('Failed to save QR code:', error);
        }
    };

    const loadQRCode = async () => {
        try {
            const stored = await AsyncStorage.getItem(QR_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const qrData: QRCodeData = {
                    ...parsed,
                    expiresAt: new Date(parsed.expiresAt),
                };

                // Check if expired
                if (new Date() > qrData.expiresAt) {
                    console.log('📱 Stored QR code expired, generating new one');
                    await generateQRCode();
                } else {
                    console.log('📱 Loaded existing QR code:', qrData.token);
                    setCurrentQRCode(qrData);
                }
            } else {
                console.log('📱 No stored QR code, generating new one');
                await generateQRCode();
            }
        } catch (error) {
            console.error('Failed to load QR code:', error);
            await generateQRCode();
        }
    };

    const validateQRCode = (token: string): { valid: boolean; data?: QRCodeData } => {
        console.log('🔍 Validating QR token:', token);
        console.log('🔍 Current QR token:', currentQRCode?.token);

        if (!currentQRCode) {
            console.log('❌ No current QR code');
            return { valid: false };
        }

        if (currentQRCode.token !== token) {
            console.log('❌ Token mismatch');
            return { valid: false };
        }

        // Check if expired
        const now = new Date();
        if (now > currentQRCode.expiresAt) {
            console.log('❌ QR code expired');
            return { valid: false };
        }

        console.log('✅ QR code validated successfully');
        return { valid: true, data: currentQRCode };
    };

    const addPickupLog = (log: Omit<PickupLog, 'id' | 'timestamp'>) => {
        const newLog: PickupLog = {
            ...log,
            id: Math.random().toString(36).substring(2, 15),
            timestamp: new Date(),
        };

        setPickupLogs((prev) => [newLog, ...prev]);
    };

    // Load QR code from storage on mount
    useEffect(() => {
        if (!hasInitialized.current) {
            console.log('📱 Initializing QR context');
            loadQRCode();
            hasInitialized.current = true;
        }
    }, []);

    return (
        <QRContext.Provider
            value={{
                currentQRCode,
                generateQRCode,
                validateQRCode,
                pickupLogs,
                addPickupLog,
            }}
        >
            {children}
        </QRContext.Provider>
    );
}

export function useQR() {
    const context = useContext(QRContext);
    if (context === undefined) {
        throw new Error('useQR must be used within a QRProvider');
    }
    return context;
}
