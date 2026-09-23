import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { customerTheme, type as t } from '../theme';

// ── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ── Single toast item ────────────────────────────────────────────────────────

const DURATION = 3200; // ms before auto-dismiss
const ANIMATION_MS = 240;

const variantStyles = {
  success: { bg: '#1A7A3C', accent: '#4ADE80' },
  error:   { bg: '#B91C1C', accent: '#FCA5A5' },
  info:    { bg: '#1E4D8C', accent: '#93C5FD' }
} as const;

const variantIcon = {
  success: '✓',
  error:   '✕',
  info:    'i'
} as const;

interface ToastItemProps {
  item: ToastMessage;
  onDismiss: (id: number) => void;
}

const ToastItem = ({ item, onDismiss }: ToastItemProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  React.useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: ANIMATION_MS, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: ANIMATION_MS, useNativeDriver: true })
    ]).start();

    // Auto-dismiss
    const timer = setTimeout(() => dismiss(), DURATION);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: ANIMATION_MS, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -8, duration: ANIMATION_MS, useNativeDriver: true })
    ]).start(() => onDismiss(item.id));
  };

  const { bg, accent } = variantStyles[item.variant];

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, opacity, transform: [{ translateY }] }]}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '33' }]}>
        <Text style={[styles.icon, { color: accent }]}>{variantIcon[item.variant]}</Text>
      </View>
      <Text style={styles.message} numberOfLines={3}>{item.message}</Text>
      <Pressable onPress={dismiss} style={styles.close} hitSlop={8}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Animated.View>
  );
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error   = useCallback((msg: string) => toast(msg, 'error'),   [toast]);
  const info    = useCallback((msg: string) => toast(msg, 'info'),    [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container sits on top of everything */}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 24 : 56,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
    // web needs pointer-events on the view itself
    ...(Platform.OS === 'web' ? ({ pointerEvents: 'box-none' } as object) : {})
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: customerTheme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    ...t.label,
    fontSize: 13
  },
  message: {
    ...t.body,
    color: '#fff',
    flex: 1
  },
  close: {
    padding: 2
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13
  }
});
