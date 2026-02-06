import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, View, TextStyle } from 'react-native';
import { Colors, Shadows } from '@/theme/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isDanger = variant === 'danger';
    const isSecondary = variant === 'secondary';

    let backgroundColor = isPrimary ? Colors.dark.primary : Colors.dark.secondary;
    let textColor = '#fff';

    if (isOutline) {
        backgroundColor = 'transparent';
        textColor = Colors.dark.primary;
    } else if (isDanger) {
        backgroundColor = Colors.dark.danger;
    } else if (isSecondary) {
        backgroundColor = Colors.dark.secondary;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[
                styles.container,
                { backgroundColor },
                isOutline && styles.outline,
                disabled && styles.disabled,
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <View style={styles.content}>
                    {icon}
                    <Text style={[styles.text, { color: textColor }, !!icon && styles.textWithIcon, textStyle]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        ...Shadows.small,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    textWithIcon: {
        marginLeft: 4,
    },
    outline: {
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.6,
    },
});
