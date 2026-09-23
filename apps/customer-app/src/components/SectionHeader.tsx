import { StyleSheet, Text, View } from 'react-native';
import { customerTheme, type as t } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  title: { ...t.heading, color: customerTheme.colors.text },
  subtitle: { ...t.caption, color: customerTheme.colors.textMuted }
});
