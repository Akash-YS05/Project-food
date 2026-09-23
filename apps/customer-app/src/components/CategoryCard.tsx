import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import { customerTheme, type as t } from '../theme';

interface CategoryCardProps {
  label: string;
  onPress: () => void;
}

export const CategoryCard = ({ label, onPress }: CategoryCardProps) => (
  <Pressable onPress={onPress} style={styles.wrapper}>
    <LinearGradient colors={['#FFF8ED', '#FBE7C0']} style={styles.gradient}>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  gradient: {
    minHeight: 92,
    borderRadius: customerTheme.radius.md,
    justifyContent: 'center',
    padding: customerTheme.spacing.md
  },
  label: { ...t.title, color: customerTheme.colors.primaryDark }
});
