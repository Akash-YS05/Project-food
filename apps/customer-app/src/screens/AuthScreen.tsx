import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppDispatch, useAppSelector } from '../store';
import { loginCustomer, loginWithGoogle, loginWithOtp, signupCustomer } from '../store/authSlice';
import { customerTheme } from '../theme';

export const AuthScreen = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('otp');
  const [form, setForm] = useState({
    fullName: 'Aarav Gupta',
    email: 'aarav@example.com',
    phone: '+919999999999',
    password: 'Customer@123'
  });

  const loading = status === 'loading';

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await dispatch(loginCustomer({ identifier: form.email, password: form.password })).unwrap();
      } else if (mode === 'signup') {
        await dispatch(signupCustomer(form)).unwrap();
      } else {
        await dispatch(loginWithOtp({ phone: form.phone, fullName: form.fullName })).unwrap();
      }
    } catch (error) {
      Alert.alert('Authentication failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Pure Veg ordering made premium</Text>
        <Text style={styles.subtitle}>Secure login with email, OTP, or a Google-ready backend endpoint.</Text>
      </View>
      <View style={styles.switchRow}>
        {(['login', 'signup', 'otp'] as const).map((item) => (
          <Text key={item} onPress={() => setMode(item)} style={[styles.switch, mode === item && styles.switchActive]}>
            {item.toUpperCase()}
          </Text>
        ))}
      </View>
      <View style={styles.form}>
        {mode !== 'login' ? <TextInput value={form.fullName} onChangeText={(fullName) => setForm((prev) => ({ ...prev, fullName }))} placeholder="Full name" style={styles.input} /> : null}
        {mode !== 'otp' ? <TextInput value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} placeholder="Email" style={styles.input} autoCapitalize="none" /> : null}
        <TextInput value={form.phone} onChangeText={(phone) => setForm((prev) => ({ ...prev, phone }))} placeholder="Phone" style={styles.input} />
        {mode !== 'otp' ? <TextInput value={form.password} onChangeText={(password) => setForm((prev) => ({ ...prev, password }))} placeholder="Password" style={styles.input} secureTextEntry /> : null}
        <PrimaryButton label={mode === 'signup' ? 'Create Account' : mode === 'otp' ? 'Continue with OTP' : 'Login'} onPress={handleSubmit} loading={loading} />
        <PrimaryButton
          label="Google Login Demo"
          variant="outline"
          onPress={async () => {
            try {
              await dispatch(
                loginWithGoogle({
                  email: 'google.customer@bambamcakeshop.com',
                  fullName: 'Google Customer',
                  googleId: 'demo-google-id'
                })
              ).unwrap();
            } catch (error) {
              Alert.alert('Google login failed', error instanceof Error ? error.message : 'Please try again.');
            }
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
    fontSize: 28,
    fontWeight: '900',
    color: customerTheme.colors.text
  },
  subtitle: {
    color: customerTheme.colors.textMuted,
    lineHeight: 22
  },
  switchRow: {
    flexDirection: 'row',
    gap: 12
  },
  switch: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: customerTheme.colors.mutedSurface,
    color: customerTheme.colors.textMuted,
    fontWeight: '700'
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
    borderWidth: 1,
    borderColor: customerTheme.colors.border,
    borderRadius: customerTheme.radius.md,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14
  }
});
