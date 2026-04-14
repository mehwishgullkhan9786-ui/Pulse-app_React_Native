import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from './haptic-tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const getIconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'index':
        return focused ? 'home' : 'home-outline';
      case 'pulse':
        return focused ? 'heart-pulse' : 'heart-outline';
      case 'Feeds':
        return focused ? 'rss' : 'rss-box';
      case 'weathers':
        return focused ? 'weather-cloudy' : 'weather-partly-cloudy';
      case 'CRUD':
        return focused ? 'database' : 'database-outline';
      case 'Profile':
        return focused ? 'account' : 'account-outline';
      default:
        return 'circle';
    }
  };

  const getTitle = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'HOME';
      case 'pulse':
        return 'PULSE';
      case 'Feeds':
        return 'FEEDS';
      case 'weathers':
        return 'WEATHER';
      case 'Profile':
        return 'PROFILE';
      default:
        return routeName.toUpperCase();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTitle(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <HapticTab
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              style={styles.tabButton}
            >
              <View style={[styles.tabContent, isFocused && styles.activeTab]}>
                <MaterialCommunityIcons
                  name={getIconName(route.name, isFocused)}
                  size={26}
                  color={isFocused ? '#00E5FF' : '#8A8D9F'}
                />
                <Text style={[styles.tabLabel, isFocused && styles.activeLabel]}>
                  {label}
                </Text>
              </View>
            </HapticTab>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C101A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 60 : 50,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    // Add any active styling if needed
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
    color: '#8A8D9F',
  },
  activeLabel: {
    color: '#00E5FF',
  },
});