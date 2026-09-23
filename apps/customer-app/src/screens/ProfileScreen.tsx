import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { PureVegBadge } from '../components/PureVegBadge';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useToast } from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutCustomer } from '../store/authSlice';
import { customerTheme, type as t } from '../theme';

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { info } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const pushToken = useAppSelector((state) => state.auth.pushToken);
  const orderCount = useAppSelector((state) => state.orders.orders.length);

  const handleLogout = () => {
    info('Signing you out…');
    void dispatch(logoutCustomer(pushToken));
  };

  return (
    <Screen>
      <PureVegBadge />
      <SectionHeader title={user?.fullName ?? 'Customer'} subtitle={user?.email ?? user?.phone} />
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.key}>Loyalty points</Text>
          <Text style={styles.val}>{user?.loyaltyPoints ?? 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>Saved addresses</Text>
          <Text style={styles.val}>{user?.addresses.length ?? 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>Total orders</Text>
          <Text style={styles.val}>{orderCount}</Text>
        </View>
      </View>
      <PrimaryButton label="View wishlist" variant="outline" onPress={() => navigation.navigate('Wishlist')} />
      <PrimaryButton label="Notifications" variant="outline" onPress={() => navigation.navigate('Notifications')} />
      <PrimaryButton label="Sign out" onPress={handleLogout} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.lg,
    gap: 14
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  key: { ...t.body, color: customerTheme.colors.textMuted },
  val: { ...t.label, color: customerTheme.colors.text }
});
