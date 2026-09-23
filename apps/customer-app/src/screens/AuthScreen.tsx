import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useToast } from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../store';
import { loginCustomer, loginWithOtp, signupCustomer } from '../store/authSlice';
import { customerTheme, type as t } from '../theme';

export const AuthScreen = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const status = useAppSelector((state) => state.auth.status);
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('otp');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });

  const loading = status === 'loading';

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await dispatch(loginCustomer({ identifier: form.email, password: form.password })).unwrap();
        success('Welcome back!');
      } else if (mode === 'signup') {
        await dispatch(signupCustomer(form)).unwrap();
        success('Account created — welcome to Bam Bam!');
      } else {
        await dispatch(loginWithOtp({ phone: form.phone, fullName: form.fullName })).unwrap();
        success('OTP sent — you\'re in!');
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Pure Veg ordering{'\n'}made premium</Text>
        <Text style={styles.subtitle}>Sign in with email, OTP, or create a new account.</Text>
      </View>
      <View style={styles.switchRow}>
        {(['login', 'signup', 'otp'] as const).map((item) => (
          <Text key={item} onPress={() => setMode(item)} style={[styles.switch, mode === item && styles.switchActive]}>
            {item === 'otp' ? 'OTP' : item === 'signup' ? 'Sign up' : 'Login'}
          </Text>
        ))}
      </View>
      <View style={styles.form}>
        {mode !== 'login' ? (
          <TextInput
            value={form.fullName}
            onChangeText={(fullName) => setForm((p) => ({ ...p, fullName }))}
            placeholder="Full name"
            style={styles.input}
          />
        ) : null}
        {mode !== 'otp' ? (
          <TextInput
            value={form.email}
            onChangeText={(email) => setForm((p) => ({ ...p, email }))}
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        ) : null}
        <TextInput
          value={form.phone}
          onChangeText={(phone) => setForm((p) => ({ ...p, phone }))}
          placeholder="Phone"
          style={styles.input}
          keyboardType="phone-pad"
        />
        {mode !== 'otp' ? (
          <TextInput
            value={form.password}
            onChangeText={(password) => setForm((p) => ({ ...p, password }))}
            placeholder="Password"
            style={styles.input}
            secureTextEntry
          />
        ) : null}
        <PrimaryButton
          label={mode === 'signup' ? 'Create account' : mode === 'otp' ? 'Continue with OTP' : 'Login'}
          onPress={handleSubmit}
          loading={loading}
        />
        <PrimaryButton
          label="Google Login"
          variant="outline"
          onPress={() => {
            // TODO: integrate expo-auth-session OAuth flow
            error('Google login is not yet available.');
          }}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingTop: customerTheme.spacing.xl,
    gap: 8
  },
  title: {
    ...t.display,
    color: customerTheme.colors.text
  },
  subtitle: {
    ...t.body,
    color: customerTheme.colors.textMuted
  },
  switchRow: {
    flexDirection: 'row',
    gap: 10
  },
  switch: {
    ...t.label,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: customerTheme.colors.mutedSurface,
    color: customerTheme.colors.textMuted
  },
  switchActive: {
    backgroundColor: '#E9F7EE',
    color: customerTheme.colors.primary
  },
  form: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.lg,
    gap: 14
  },
  input: {
    ...t.input,
    borderWidth: 1,
    borderColor: customerTheme.colors.border,
    borderRadius: customerTheme.radius.md,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14
  }
});
