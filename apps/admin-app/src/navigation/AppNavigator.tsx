import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useAppSelector } from '../store';
import { DashboardScreen } from '../screens/DashboardScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { PeopleScreen } from '../screens/PeopleScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { adminTheme } from '../theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ color: focused ? adminTheme.colors.primary : adminTheme.colors.textMuted, fontWeight: '700' }}>{label}</Text>
);

const MainTabs = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 72, paddingBottom: 10 } }}>
    <Tabs.Screen name="DashboardTab" component={DashboardScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Dashboard" focused={focused} /> }} />
    <Tabs.Screen name="OrdersTab" component={OrdersScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Orders" focused={focused} /> }} />
    <Tabs.Screen name="ProductsTab" component={ProductsScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Products" focused={focused} /> }} />
    <Tabs.Screen name="InventoryTab" component={InventoryScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Stock" focused={focused} /> }} />
    <Tabs.Screen name="PeopleTab" component={PeopleScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="People" focused={focused} /> }} />
    <Tabs.Screen name="InsightsTab" component={InsightsScreen} options={{ tabBarLabel: ({ focused }) => <TabLabel label="Insights" focused={focused} /> }} />
  </Tabs.Navigator>
);

export const AppNavigator = () => {
  const user = useAppSelector((state) => state.adminAuth.user);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};
