import Theme from '@/core/theme';
import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface IVerticalSafeAreaViewProps {
    mode?: 'margin' | 'padding';
    children: JSX.Element | JSX.Element[];
    style?: StyleProp<ViewStyle>;
}
export default function VerticalSafeAreaView(
    props: IVerticalSafeAreaViewProps,
) {
    const {children, style, mode} = props;
    const theme = Theme.useTheme();
    return (
        <SafeAreaView
            style={StyleSheet.compose(
                style,
                theme.id === 'custom'
                    ? {}
                    : {
                          backgroundColor: theme.colors.pageBackground,
                      },
            )}
            mode={mode}
            edges={['top', 'bottom']}>
            {children}
        </SafeAreaView>
    );
}
