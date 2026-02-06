import React from 'react';
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

interface ScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({ children, style, contentContainerStyle }) => {
    return (
        <SafeAreaView style={[styles.container, style]}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.content, contentContainerStyle]}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
    },
});
