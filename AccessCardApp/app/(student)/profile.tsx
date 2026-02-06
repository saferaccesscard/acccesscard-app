import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { signOut, user } = useAuth();

    return (
        <Screen style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Info */}
                <View style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>👨‍👩‍👧</Text>
                    </View>
                    <Text style={styles.userName}>Sarah Johnson</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>Parent</Text>
                    </View>
                </View>

                {/* Settings Sections */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="person-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="people-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Manage Guardians</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="school-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Student Information</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="notifications-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="language-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Language</Text>
                        <View style={styles.menuRight}>
                            <Text style={styles.menuValue}>English</Text>
                            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="help-circle-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Help Center</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="document-text-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>Terms & Privacy</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIcon}>
                            <Ionicons name="information-circle-outline" size={20} color={Colors.dark.primary} />
                        </View>
                        <Text style={styles.menuText}>About</Text>
                        <View style={styles.menuRight}>
                            <Text style={styles.menuValue}>v1.0.0</Text>
                            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Logout"
                    onPress={signOut}
                    variant="danger"
                    style={styles.logoutButton}
                />

                <Text style={styles.footer}>AccessCard © 2024</Text>
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
        paddingBottom: 32,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    userCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        fontSize: 56,
    },
    userName: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    userEmail: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 10,
    },
    roleText: {
        color: Colors.dark.primary,
        fontSize: 11,
        fontWeight: '600',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 6,
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    menuText: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 14,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    menuValue: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
    },
    logoutButton: {
        marginTop: 8,
        marginBottom: 20,
    },
    footer: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 16,
    },
});
