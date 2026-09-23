import { brand } from '@bambam/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { customerTheme, type as t } from '../theme';

export const OnboardingScreen = ({ onDone }: { onDone: () => void }) => (
  <Screen>
    <LinearGradient colors={['#1A7A3C', '#56AB2F']} style={styles.hero}>
      <Text style={styles.appName}>{brand.appName}</Text>
      <Text style={styles.tagline}>{brand.tagline}</Text>
      <Text style={styles.copy}>{brand.trustMessage}</Text>
    </LinearGradient>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>What you get</Text>
      {[
        'Fresh cakes, pizza, and burgers from a pure veg kitchen.',
        'Live order tracking with instant updates from the shop.',
        'Full ingredient transparency and a trusted delivery flow.'
      ].map((line) => (
        <View key={line} style={styles.bulletRow}>
          <Text style={styles.bullet}>·</Text>
          <Text style={styles.bulletText}>{line}</Text>
        </View>
      ))}
    </View>
    <PrimaryButton label="Start ordering" onPress={onDone} />
  </Screen>
);

const styles = StyleSheet.create({
  hero: {
    minHeight: 260,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.xl,
    justifyContent: 'flex-end',
    gap: 10
  },
  appName: { ...t.display, color: '#fff' },
  tagline: { ...t.title, color: '#fff' },
  copy: { ...t.body, color: '#F4FCEF' },
  card: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.lg,
    gap: 14
  },
  cardTitle: { ...t.heading, color: customerTheme.colors.text },
  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { ...t.body, color: customerTheme.colors.primary, marginTop: 1 },
  bulletText: { ...t.body, color: customerTheme.colors.textMuted, flex: 1 }
});
