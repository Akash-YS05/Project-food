import { brand } from '@bambam/shared';
import { StyleSheet, Text, View } from 'react-native';
import { customerTheme, type as t } from '../theme';

export const PureVegBadge = () => (
  <View style={styles.wrapper}>
    <View style={styles.dot} />
    <Text style={styles.label}>{brand.pureVegBadgeText}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: '#E9F7EE'
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: customerTheme.colors.pureVeg,
    borderWidth: 1,
    borderColor: '#0F6B30'
  },
  label: { ...t.caption, color: customerTheme.colors.primaryDark }
});
