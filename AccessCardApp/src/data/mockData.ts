export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    class: string;
    rollNumber: string;
    photoUrl?: string;
    guardians: Guardian[];
    qrCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Guardian {
    id: string;
    name: string;
    relationship: 'Mother' | 'Father' | 'Grandparent' | 'Other';
    phone: string;
    email?: string;
    photoIdUrl?: string;
    approved: boolean;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'security_guard' | 'supervisor';
    status: 'active' | 'inactive';
    photoUrl?: string;
    createdAt: Date;
    lastActive?: Date;
    totalScans: number;
    approvedScans: number;
    deniedScans: number;
}

export interface PickupActivity {
    id: string;
    studentName: string;
    guardianName: string;
    gate: string;
    timestamp: Date;
    status: 'approved' | 'denied';
    staffName?: string;
}

// Mock Students
export const mockStudents: Student[] = [
    {
        id: '1',
        firstName: 'Emma',
        lastName: 'Johnson',
        grade: '3',
        class: 'A',
        rollNumber: '2024-A-145',
        photoUrl: 'https://i.pravatar.cc/150?img=25',
        guardians: [
            {
                id: 'g1',
                name: 'Sarah Johnson',
                relationship: 'Mother',
                phone: '+1234567890',
                email: 'sarah@email.com',
                approved: true,
            },
            {
                id: 'g2',
                name: 'Michael Johnson',
                relationship: 'Father',
                phone: '+1234567891',
                email: 'michael@email.com',
                approved: true,
            },
        ],
        qrCode: 'PICKUP-1234567890-abc123',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
    },
    {
        id: '2',
        firstName: 'Liam',
        lastName: 'Smith',
        grade: '5',
        class: 'B',
        rollNumber: '2024-B-089',
        photoUrl: 'https://i.pravatar.cc/150?img=12',
        guardians: [
            {
                id: 'g3',
                name: 'Jennifer Smith',
                relationship: 'Mother',
                phone: '+1234567892',
                approved: true,
            },
        ],
        qrCode: 'PICKUP-1234567891-def456',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date(),
    },
    {
        id: '3',
        firstName: 'Olivia',
        lastName: 'Brown',
        grade: '2',
        class: 'A',
        rollNumber: '2024-A-067',
        photoUrl: 'https://i.pravatar.cc/150?img=32',
        guardians: [
            {
                id: 'g4',
                name: 'David Brown',
                relationship: 'Father',
                phone: '+1234567893',
                approved: true,
            },
        ],
        qrCode: 'PICKUP-1234567892-ghi789',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
    },
    {
        id: '4',
        firstName: 'Noah',
        lastName: 'Davis',
        grade: '4',
        class: 'C',
        rollNumber: '2024-C-112',
        photoUrl: 'https://i.pravatar.cc/150?img=15',
        guardians: [
            {
                id: 'g5',
                name: 'Emily Davis',
                relationship: 'Mother',
                phone: '+1234567894',
                approved: true,
            },
        ],
        qrCode: 'PICKUP-1234567893-jkl012',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date(),
    },
    {
        id: '5',
        firstName: 'Ava',
        lastName: 'Wilson',
        grade: '1',
        class: 'B',
        rollNumber: '2024-B-034',
        photoUrl: 'https://i.pravatar.cc/150?img=28',
        guardians: [
            {
                id: 'g6',
                name: 'Robert Wilson',
                relationship: 'Father',
                phone: '+1234567895',
                approved: true,
            },
            {
                id: 'g7',
                name: 'Linda Wilson',
                relationship: 'Grandparent',
                phone: '+1234567896',
                approved: true,
            },
        ],
        qrCode: 'PICKUP-1234567894-mno345',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date(),
    },
];

// Mock Staff
export const mockStaff: StaffMember[] = [
    {
        id: 's1',
        name: 'John Smith',
        email: 'john@school.com',
        phone: '+1234567800',
        role: 'security_guard',
        status: 'active',
        photoUrl: 'https://i.pravatar.cc/150?img=33',
        createdAt: new Date('2023-09-01'),
        lastActive: new Date(),
        totalScans: 245,
        approvedScans: 240,
        deniedScans: 5,
    },
    {
        id: 's2',
        name: 'Maria Garcia',
        email: 'maria@school.com',
        phone: '+1234567801',
        role: 'supervisor',
        status: 'active',
        photoUrl: 'https://i.pravatar.cc/150?img=44',
        createdAt: new Date('2023-08-15'),
        lastActive: new Date(),
        totalScans: 312,
        approvedScans: 308,
        deniedScans: 4,
    },
    {
        id: 's3',
        name: 'David Lee',
        email: 'david@school.com',
        phone: '+1234567802',
        role: 'security_guard',
        status: 'active',
        photoUrl: 'https://i.pravatar.cc/150?img=51',
        createdAt: new Date('2023-10-01'),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        totalScans: 178,
        approvedScans: 175,
        deniedScans: 3,
    },
    {
        id: 's4',
        name: 'Sarah Johnson',
        email: 'sarah.j@school.com',
        phone: '+1234567803',
        role: 'security_guard',
        status: 'inactive',
        photoUrl: 'https://i.pravatar.cc/150?img=47',
        createdAt: new Date('2023-07-01'),
        lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        totalScans: 89,
        approvedScans: 87,
        deniedScans: 2,
    },
];

// Mock Recent Activity
export const mockRecentActivity: PickupActivity[] = [
    {
        id: 'a1',
        studentName: 'Emma Johnson',
        guardianName: 'Sarah Johnson',
        gate: 'Main Gate A',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        status: 'approved',
        staffName: 'John Smith',
    },
    {
        id: 'a2',
        studentName: 'Liam Smith',
        guardianName: 'Jennifer Smith',
        gate: 'Main Gate A',
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
        status: 'approved',
        staffName: 'Maria Garcia',
    },
    {
        id: 'a3',
        studentName: 'Unknown',
        guardianName: 'Unknown',
        gate: 'Side Gate B',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
        status: 'denied',
        staffName: 'David Lee',
    },
    {
        id: 'a4',
        studentName: 'Olivia Brown',
        guardianName: 'David Brown',
        gate: 'Main Gate A',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        status: 'approved',
        staffName: 'John Smith',
    },
    {
        id: 'a5',
        studentName: 'Noah Davis',
        guardianName: 'Emily Davis',
        gate: 'Main Gate A',
        timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
        status: 'approved',
        staffName: 'Maria Garcia',
    },
];
