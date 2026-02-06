import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents, Student } from '@/data/mockData';
import { AddStudentModal } from '@/components/admin/AddStudentModal';
import { useRouter } from 'expo-router';

export default function StudentsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | string>('all');
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddStudent = (newStudent: Student) => {
        setStudents([...students, newStudent]);
    };

    const grades = ['all', ...Array.from(new Set(students.map(s => s.grade)))];

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = selectedFilter === 'all' || student.grade === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const renderStudentCard = (student: Student) => (
        <TouchableOpacity
            key={student.id}
            style={styles.studentCard}
            onPress={() => router.push(`/(admin)/student/${student.id}` as any)}
        >
            <Image
                source={{ uri: student.photoUrl || 'https://i.pravatar.cc/150?img=1' }}
                style={styles.studentPhoto}
            />
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>
                    {student.firstName} {student.lastName}
                </Text>
                <Text style={styles.studentDetails}>
                    Grade {student.grade} • Class {student.class} • {student.rollNumber}
                </Text>
                <Text style={styles.guardianCount}>
                    {student.guardians.length} Guardian{student.guardians.length !== 1 ? 's' : ''}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Students</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search students..."
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
                {grades.map((grade) => (
                    <TouchableOpacity
                        key={grade}
                        style={[
                            styles.filterChip,
                            selectedFilter === grade && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedFilter(grade)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedFilter === grade && styles.filterChipTextActive,
                            ]}
                        >
                            {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Student List */}
            <ScrollView
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.resultCount}>
                    {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''}
                </Text>

                {filteredStudents.length > 0 ? (
                    filteredStudents.map(renderStudentCard)
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={64} color={Colors.dark.textTertiary} />
                        <Text style={styles.emptyText}>No students found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try a different search term' : 'Add your first student to get started'}
                        </Text>
                    </View>
                )}
            </ScrollView>
            <AddStudentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddStudent}
            />
        </Screen>
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
        backgroundColor: Colors.dark.primary,
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
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
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
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    studentPhoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    studentDetails: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
        marginBottom: 4,
    },
    guardianCount: {
        fontSize: 12,
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
