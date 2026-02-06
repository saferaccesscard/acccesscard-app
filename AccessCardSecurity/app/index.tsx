import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/theme/colors';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
                <ActivityIndicator size="large" color={Colors.dark.primary} />
            </View>
        );
    }

    return user ? <Redirect href="/(app)/scanner" /> : <Redirect href="/login" />;
}
