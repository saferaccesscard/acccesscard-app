export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'security_guard' | 'supervisor';
    password: 'password'; // Mock password for all
}

export const mockStaff: StaffMember[] = [
    {
        id: '1',
        name: 'John Guard',
        email: 'guard@school.com',
        role: 'security_guard',
        password: 'password',
    },
    {
        id: '2',
        name: 'Sarah Supervisor',
        email: 'admin@school.com',
        role: 'supervisor',
        password: 'password',
    },
];

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    class: string;
    guardians: { name: string; relationship: string; approved: boolean }[];
    qrCode: string;
    photoUrl?: string;
}

export const mockStudents: Student[] = [
    {
        id: '1',
        firstName: 'Emma',
        lastName: 'Johnson',
        grade: '3',
        class: 'A',
        guardians: [
            { name: 'Sarah Johnson', relationship: 'Mother', approved: true },
            { name: 'Mike Johnson', relationship: 'Father', approved: true }
        ],
        qrCode: 'PICKUP-123456-EMMA',
        photoUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: '2',
        firstName: 'Liam',
        lastName: 'Williams',
        grade: '5',
        class: 'B',
        guardians: [
            { name: 'Robert Williams', relationship: 'Father', approved: true },
            { name: 'Uncle Bob', relationship: 'Uncle', approved: false }
        ],
        qrCode: 'PICKUP-654321-LIAM',
        photoUrl: 'https://i.pravatar.cc/150?img=11',
    },
];
