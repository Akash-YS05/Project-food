import { brand } from '@bambam/shared';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { AuthScreen } from '../screens/AuthScreen';
import { CartScreen } from '../screens/CartScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { useAppSelector } from '../store';
import { customerTheme } from '../theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ color: focused ? customerTheme.colors.primary : customerTheme.colors.textMuted, fontWeight: '700' }}>
    {label}
  </Text>
);

const MainTabs = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 70, paddingBottom: 10 } }}>
    <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />, title: brand.appName }} />
    <Tabs.Screen name="CatalogTab" component={CatalogScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Menu" focused={focused} /> }} />
    <Tabs.Screen name="CartTab" component={CartScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Cart" focused={focused} /> }} />
    <Tabs.Screen name="OrdersTab" component={OrdersScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Orders" focused={focused} /> }} />
    <Tabs.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} /> }} />
  </Tabs.Navigator>
);

export const AppNavigator = () => {
  const auth = useAppSelector((state) => state.auth);
  const [onboardingSeen, setOnboardingSeen] = useState(false);

  const initialRoute = useMemo(() => {
    if (!onboardingSeen) return 'Onboarding';
    return auth.user ? 'Main' : 'Auth';
  }, [auth.user, onboardingSeen]);

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      {!onboardingSeen ? (
        <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
          {(props) => <OnboardingScreen {...props} onDone={() => setOnboardingSeen(true)} />}
        </Stack.Screen>
      ) : null}
      {!auth.user ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product details' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: 'Track order' }} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        </>
      )}
    </Stack.Navigator>
  );
};
