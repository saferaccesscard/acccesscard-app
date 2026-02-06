import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents, Guardian } from '@/data/mockData';

export default function GuardiansScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Extract all guardians from students and flatten the array
    const allGuardians = mockStudents.reduce<Array<Guardian & { studentName: string }>>((acc, student) => {
        const studentGuardians = student.guardians.map(g => ({
            ...g,
            studentName: `${student.firstName} ${student.lastName}`
        }));
        return [...acc, ...studentGuardians];
    }, []);

    const filteredGuardians = allGuardians.filter(guardian =>
        guardian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guardian.phone.includes(searchQuery) ||
        (guardian.email && guardian.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderGuardianCard = (guardian: Guardian & { studentName: string }, index: number) => (
        <TouchableOpacity key={`${guardian.id}-${index}`} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={24} color={Colors.dark.textSecondary} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{guardian.name}</Text>
                    <Text style={styles.relationship}>{guardian.relationship} of {guardian.studentName}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: guardian.approved ? Colors.dark.approved + '20' : Colors.dark.warning + '20' }]}>
                    <Text style={[styles.badgeText, { color: guardian.approved ? Colors.dark.approved : Colors.dark.warning }]}>
                        {guardian.approved ? 'Approved' : 'Pending'}
                    </Text>
                </View>
            </View>

            <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                    <Ionicons name="call-outline" size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.contactText}>{guardian.phone}</Text>
                </View>
                {guardian.email && (
                    <View style={styles.contactRow}>
                        <Ionicons name="mail-outline" size={16} color={Colors.dark.textSecondary} />
                        <Text style={styles.contactText}>{guardian.email}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Guardians</Text>
                {/* Add button can be added later if we want to add guardians independently */}
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, phone, or email..."
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.countText}>{filteredGuardians.length} Guardians</Text>

                {filteredGuardians.length > 0 ? (
                    filteredGuardians.map(renderGuardianCard)
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="person-outline" size={64} color={Colors.dark.textTertiary} />
                        <Text style={styles.emptyText}>No guardians found</Text>
                    </View>
                )}
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
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    countText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 12,
    },
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    relationship: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    contactInfo: {
        gap: 8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        marginTop: 16,
    },
});
