import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PluginList from './views/pluginList';
import PluginSort from './views/pluginSort';
import PluginSubscribe from './views/pluginSubscribe';
import {Platform} from 'react-native';
import Theme from '@/core/theme';

const Stack = createNativeStackNavigator<any>();

const routes = [
    {
        path: '/pluginsetting/list',
        component: PluginList,
    },
    {
        path: '/pluginsetting/sort',
        component: PluginSort,
    },
    {
        path: '/pluginsetting/subscribe',
        component: PluginSubscribe,
    },
];

export default function PluginSetting() {
    const theme = Theme.useTheme();
    return (
        <Stack.Navigator
            initialRouteName={routes[0].path}
            screenOptions={{
                statusBarColor: 'transparent',
                statusBarTranslucent: true,
                headerShown: false,
                animation:
                    Platform.OS === 'ios' && theme.id === 'custom'
                        ? 'fade'
                        : 'slide_from_right',
                animationDuration: 100,
            }}>
            {routes.map(route => (
                <Stack.Screen
                    key={route.path}
                    name={route.path}
                    component={route.component}
                />
            ))}
        </Stack.Navigator>
    );
}
