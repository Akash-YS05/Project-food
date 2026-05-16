import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { customerTheme } from '../theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentStyle]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: customerTheme.colors.background
  },
  content: {
    padding: customerTheme.spacing.md,
    gap: customerTheme.spacing.md
  }
});
