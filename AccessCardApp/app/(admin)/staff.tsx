import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStaff, StaffMember } from '@/data/mockData';
import { AddStaffModal } from '@/components/admin/AddStaffModal';
import { useRouter } from 'expo-router';

export default function StaffScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddStaff = (newStaff: StaffMember) => {
        setStaffList([...staffList, newStaff]);
    };

    const filteredStaff = staffList.filter(staff => {
        const matchesSearch =
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            selectedFilter === 'all' ||
            staff.status === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const renderStaffCard = (staff: StaffMember) => {
        const successRate = staff.totalScans > 0
            ? Math.round((staff.approvedScans / staff.totalScans) * 100)
            : 0;

        return (
            <TouchableOpacity
                key={staff.id}
                style={styles.staffCard}
                onPress={() => router.push(`/(admin)/staff/${staff.id}` as any)}
            >
                <Image
                    source={{ uri: staff.photoUrl || 'https://i.pravatar.cc/150?img=1' }}
                    style={styles.staffPhoto}
                />
                <View style={styles.staffInfo}>
                    <View style={styles.staffHeader}>
                        <Text style={styles.staffName}>{staff.name}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: staff.status === 'active' ? Colors.dark.approved + '20' : Colors.dark.textTertiary + '20' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: staff.status === 'active' ? Colors.dark.approved : Colors.dark.textTertiary }
                            ]}>
                                {staff.status}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.staffEmail}>{staff.email}</Text>
                    <Text style={styles.staffRole}>
                        {staff.role === 'security_guard' ? 'Security Guard' : 'Supervisor'}
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{staff.totalScans}</Text>
                            <Text style={styles.statLabel}>Scans</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: Colors.dark.approved }]}>
                                {successRate}%
                            </Text>
                            <Text style={styles.statLabel}>Success</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{staff.deniedScans}</Text>
                            <Text style={styles.statLabel}>Denied</Text>
                        </View>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
        );
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Staff</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search staff..."
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

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {(['all', 'active', 'inactive'] as const).map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterChip,
                            selectedFilter === filter && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedFilter === filter && styles.filterChipTextActive,
                            ]}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Staff List */}
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.resultCount}>
                    {filteredStaff.length} Staff Member{filteredStaff.length !== 1 ? 's' : ''}
                </Text>

                {filteredStaff.length > 0 ? (
                    filteredStaff.map(renderStaffCard)
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="shield-checkmark-outline" size={64} color={Colors.dark.textTertiary} />
                        <Text style={styles.emptyText}>No staff members found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try a different search term' : 'Add your first staff member to get started'}
                        </Text>
                    </View>
                )}
            </ScrollView>
            <AddStaffModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddStaff}
            />
        </Screen >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.secondary,
        justifyContent: 'center',
        alignItems: 'center',
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
    filterContainer: {
        marginBottom: 16,
    },
    filterContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.dark.card,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    filterChipActive: {
        backgroundColor: Colors.dark.secondary,
        borderColor: Colors.dark.secondary,
    },
    filterChipText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    filterChipTextActive: {
        color: 'white',
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    resultCount: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 12,
    },
    staffCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    staffPhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    staffInfo: {
        flex: 1,
    },
    staffHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    staffName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    staffEmail: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
        marginBottom: 2,
    },
    staffRole: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.dark.textTertiary,
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
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
});
