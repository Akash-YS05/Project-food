import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/orderSlice';
import { customerTheme } from '../theme';

export const CheckoutScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.cart);
  const products = useAppSelector((state) => state.catalog.products);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'qr'>('upi');
  const [deliveryTime, setDeliveryTime] = useState('Today, 7:00 PM');
  const [note, setNote] = useState('Please keep it fresh and deliver carefully.');

  const summary = useMemo(() => {
    const subtotal = cart.items.reduce((sum, item) => {
      const product = products.find((entry) => entry._id === item.productId);
      const variant = product?.variants.find((entry) => (entry._id ?? entry.value) === item.variantId);
      return sum + ((variant?.price ?? 0) + item.addOns.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0)) * item.quantity;
    }, 0);
    const tax = subtotal * 0.05;
    const deliveryCharge = subtotal > 499 ? 0 : 40;
    const discount = cart.coupon ? Math.min(subtotal * 0.1, cart.coupon.maxDiscountValue ?? 9999) : 0;
    return { subtotal, tax, deliveryCharge, discount, grandTotal: subtotal + tax + deliveryCharge - discount };
  }, [cart.coupon, cart.items, products]);

  const address = auth?.addresses[0];

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert('Missing address', 'Please add a delivery address in your profile.');
      return;
    }

    try {
      const order = await dispatch(
        placeOrder({
          items: cart.items.map((item) => {
            const product = products.find((entry) => entry._id === item.productId)!;
            const variant = product.variants.find((entry) => (entry._id ?? entry.value) === item.variantId)!;
            return {
              productId: product._id,
              productName: product.name,
              category: product.category,
              imageUrl: product.imageUrls[0],
              variantLabel: variant.label,
              quantity: item.quantity,
              unitPrice: variant.price,
              totalPrice: (variant.price + item.addOns.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0)) * item.quantity,
              addOns: item.addOns,
              veg: true
            };
          }),
          address,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          pricing: summary,
          scheduledFor: deliveryTime,
          note,
          couponCode: cart.coupon?.code
        })
      ).unwrap();

      dispatch(clearCart());
      navigation.navigate('OrderTracking', { orderId: order._id });
    } catch (error) {
      Alert.alert('Order failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen>
      <SectionHeader title="Checkout" subtitle="Transparent pricing, flexible payment, pure veg trust." />
      <View style={styles.card}>
        <Text style={styles.label}>Delivery address</Text>
        <Text>{address?.label}</Text>
        <Text>{address?.line1}</Text>
        <Text>
          {address?.city}, {address?.state} {address?.postalCode}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Preferred delivery time</Text>
        <TextInput value={deliveryTime} onChangeText={setDeliveryTime} style={styles.input} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Order note</Text>
        <TextInput value={note} onChangeText={setNote} style={[styles.input, styles.note]} multiline />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Payment method</Text>
        <View style={styles.methodRow}>
          {(['cod', 'upi', 'qr'] as const).map((method) => (
            <Text
              key={method}
              onPress={() => setPaymentMethod(method)}
              style={[styles.methodChip, paymentMethod === method && styles.methodChipActive]}
            >
              {method.toUpperCase()}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text>Subtotal: Rs. {summary.subtotal.toFixed(0)}</Text>
        <Text>Tax: Rs. {summary.tax.toFixed(0)}</Text>
        <Text>Delivery: Rs. {summary.deliveryCharge.toFixed(0)}</Text>
        <Text>Discount: Rs. {summary.discount.toFixed(0)}</Text>
        <Text style={styles.total}>Grand total: Rs. {summary.grandTotal.toFixed(0)}</Text>
      </View>
      <PrimaryButton label="Place order" onPress={handlePlaceOrder} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    padding: customerTheme.spacing.md,
    gap: 8
  },
  label: {
    fontWeight: '800',
    color: customerTheme.colors.text
  },
  input: {
    borderWidth: 1,
    borderColor: customerTheme.colors.border,
    borderRadius: customerTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff'
  },
  note: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10
  },
  methodChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: customerTheme.colors.mutedSurface
  },
  methodChipActive: {
    backgroundColor: '#E9F7EE',
    color: customerTheme.colors.primary
  },
  total: {
    fontWeight: '900',
    color: customerTheme.colors.primary
  }
});
