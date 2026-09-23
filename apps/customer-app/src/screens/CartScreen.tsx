import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useToast } from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../store';
import { applyCoupon, removeFromCart, updateQuantity } from '../store/cartSlice';
import { customerTheme, type as t } from '../theme';
import { formatPrice } from '../utils/format';

export const CartScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { success } = useToast();
  const cart = useAppSelector((state) => state.cart);
  const products = useAppSelector((state) => state.catalog.products);

  const enrichedItems = useMemo(
    () =>
      cart.items.map((item) => {
        const product = products.find((e) => e._id === item.productId);
        const variant = product?.variants.find((e) => (e._id ?? e.value) === item.variantId);
        return {
          ...item,
          product,
          variant,
          lineTotal: ((variant?.price ?? 0) + item.addOns.reduce((s, a) => s + a.price, 0)) * item.quantity
        };
      }),
    [cart.items, products]
  );

  const totals = useMemo(() => {
    const subtotal = enrichedItems.reduce((s, i) => s + i.lineTotal, 0);
    const discount = cart.coupon ? Math.min(subtotal * 0.1, cart.coupon.maxDiscountValue ?? 9999) : 0;
    const deliveryCharge = subtotal > 499 ? 0 : 40;
    const tax = subtotal * 0.05;
    return { subtotal, discount, deliveryCharge, tax, grandTotal: subtotal + deliveryCharge + tax - discount };
  }, [cart.coupon, enrichedItems]);

  const handleCoupon = () => {
    if (cart.coupon) {
      dispatch(applyCoupon(undefined));
      success('Coupon removed.');
    } else {
      dispatch(
        applyCoupon({
          code: 'PUREVEG10',
          title: 'Welcome offer',
          description: '10% off your order',
          discountType: 'percentage',
          discountValue: 10,
          minimumOrderValue: 399,
          maxDiscountValue: 120,
          isActive: true
        })
      );
      success('Coupon PUREVEG10 applied — 10% off!');
    }
  };

  return (
    <Screen>
      <SectionHeader title="Your cart" subtitle="Freshly prepared pure veg items only." />

      {enrichedItems.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty. Browse the menu to add items.</Text>
      ) : null}

      {enrichedItems.map((item) => (
        <View key={`${item.productId}-${item.variantId}`} style={styles.card}>
          <Text style={styles.name}>{item.product?.name}</Text>
          <Text style={styles.meta}>{item.variant?.label}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>{formatPrice(item.lineTotal)}</Text>
            <View style={styles.qtyRow}>
              <Text
                onPress={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 }))}
                style={styles.qtyBtn}
              >−</Text>
              <Text style={styles.qtyVal}>{item.quantity}</Text>
              <Text
                onPress={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 }))}
                style={styles.qtyBtn}
              >+</Text>
            </View>
          </View>
          <Pressable onPress={() => dispatch(removeFromCart({ productId: item.productId, variantId: item.variantId }))}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.couponCard}>
        <Text style={styles.couponTitle}>Offer</Text>
        <PrimaryButton
          label={cart.coupon ? '✓ PUREVEG10 applied' : 'Apply PUREVEG10'}
          variant="outline"
          onPress={handleCoupon}
        />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}><Text style={styles.summaryKey}>Subtotal</Text><Text style={styles.summaryVal}>{formatPrice(totals.subtotal)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryKey}>Tax (5%)</Text><Text style={styles.summaryVal}>{formatPrice(totals.tax)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryKey}>Delivery</Text><Text style={styles.summaryVal}>{formatPrice(totals.deliveryCharge)}</Text></View>
        {totals.discount > 0 ? (
          <View style={styles.summaryRow}><Text style={styles.summaryKey}>Discount</Text><Text style={[styles.summaryVal, { color: customerTheme.colors.primary }]}>-{formatPrice(totals.discount)}</Text></View>
        ) : null}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalKey}>Grand total</Text>
          <Text style={styles.totalVal}>{formatPrice(totals.grandTotal)}</Text>
        </View>
      </View>

      <PrimaryButton label="Proceed to checkout" onPress={() => navigation.navigate('Checkout')} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  empty: { ...t.body, color: customerTheme.colors.textMuted, textAlign: 'center', paddingVertical: 32 },
  card: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.md,
    gap: 8
  },
  name: { ...t.title, color: customerTheme.colors.text },
  meta: { ...t.caption, color: customerTheme.colors.textMuted },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { ...t.price, color: customerTheme.colors.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    ...t.label,
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 16,
    backgroundColor: customerTheme.colors.mutedSurface,
    color: customerTheme.colors.text
  },
  qtyVal: { ...t.label, color: customerTheme.colors.text, minWidth: 20, textAlign: 'center' },
  remove: { ...t.caption, color: customerTheme.colors.error },
  couponCard: {
    backgroundColor: '#FFF8ED',
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.md,
    gap: 12
  },
  couponTitle: { ...t.label, color: customerTheme.colors.primaryDark },
  summary: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.md,
    gap: 10
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryKey: { ...t.body, color: customerTheme.colors.textMuted },
  summaryVal: { ...t.body, color: customerTheme.colors.text },
  totalRow: { paddingTop: 10, borderTopWidth: 1, borderTopColor: customerTheme.colors.border, marginTop: 4 },
  totalKey: { ...t.label, color: customerTheme.colors.text },
  totalVal: { ...t.price, color: customerTheme.colors.primary }
});
