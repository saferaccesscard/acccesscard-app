import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { signOut, user } = useAuth();
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(true);

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderSettingItem = (
        icon: keyof typeof Ionicons.glyphMap,
        title: string,
        subtitle?: string,
        rightElement?: React.ReactNode,
        onPress?: () => void,
        color: string = Colors.dark.primary
    ) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement || (
                onPress && <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
            )}
        </TouchableOpacity>
    );

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileCard}>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0) || 'A'}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.name || 'Admin User'}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user?.role || 'ADMIN'}</Text>
                        </View>
                    </View>
                </View>

                {renderSectionHeader('App Preferences')}
                <View style={styles.section}>
                    {renderSettingItem(
                        'notifications-outline',
                        'Notifications',
                        'Receive alerts for unusual activity',
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                            thumbColor={'white'}
                        />
                    )}
                    {renderSettingItem(
                        'moon-outline',
                        'Dark Mode',
                        'Use dark theme across the app',
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
                            thumbColor={'white'}
                        />
                    )}
                </View>

                {renderSectionHeader('Security')}
                <View style={styles.section}>
                    {renderSettingItem('key-outline', 'Change Password', undefined, undefined, () => { })}
                    {renderSettingItem('shield-checkmark-outline', 'Privacy Policy', undefined, undefined, () => { })}
                </View>

                {renderSectionHeader('Support')}
                <View style={styles.section}>
                    {renderSettingItem('help-circle-outline', 'Help & Support', undefined, undefined, () => { })}
                    {renderSettingItem('information-circle-outline', 'About AccessCard', 'Version 1.0.0', undefined, () => { })}
                </View>

                <View style={styles.logoutContainer}>
                    <Button
                        title="Logout"
                        onPress={signOut}
                        variant="outline"
                        style={styles.logoutButton}
                        textStyle={{ color: Colors.dark.denied }}
                        icon={<Ionicons name="log-out-outline" size={20} color={Colors.dark.denied} />}
                    />
                    <Text style={styles.versionText}>AccessCard v1.0.0 (Build 124)</Text>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: Colors.dark.secondary + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.dark.secondary,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.textSecondary,
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark.text,
    },
    settingSubtitle: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    logoutContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    logoutButton: {
        width: '100%',
        borderColor: Colors.dark.denied,
        borderWidth: 1,
    },
    versionText: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
        marginTop: 16,
    },
});
