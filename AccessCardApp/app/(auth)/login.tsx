import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/theme/colors';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            await signIn(email, password);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>AccessCard</Text>
                    <Text style={styles.subtitle}>Secure Campus Access</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="admin@school.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        style={styles.button}
                    />

                    <View style={styles.hint}>
                        <Text style={styles.hintText}>Dev Hints:</Text>
                        <Text style={styles.hintText}>admin@school.com</Text>
                        <Text style={styles.hintText}>security@school.com</Text>
                        <Text style={styles.hintText}>parent@school.com</Text>
                    </View>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        justifyContent: 'center',
        flex: 1,
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.textSecondary,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 24,
    },
    errorText: {
        color: Colors.light.error,
        textAlign: 'center',
        marginTop: 10,
    },
    hint: {
        marginTop: 40,
        padding: 16,
        backgroundColor: Colors.light.surfaceHighlight,
        borderRadius: 8,
    },
    hintText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontFamily: 'monospace',
    }
});
