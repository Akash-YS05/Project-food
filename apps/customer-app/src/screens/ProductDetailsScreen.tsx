import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { PureVegBadge } from '../components/PureVegBadge';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useToast } from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/catalogSlice';
import { customerTheme, type as t } from '../theme';
import { formatPrice } from '../utils/format';

export const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const { success } = useToast();
  const product = useAppSelector((state) => state.catalog.products.find((item) => item._id === productId));
  const wishlistIds = useAppSelector((state) => state.catalog.wishlistIds);
  const [variantId, setVariantId] = useState(product?.variants[0]?._id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const activeVariant = useMemo(
    () => product?.variants.find((item) => item._id === variantId) ?? product?.variants[0],
    [product, variantId]
  );

  if (!product || !activeVariant) {
    return (
      <Screen>
        <Text style={{ ...t.body, color: customerTheme.colors.textMuted }}>Product not found.</Text>
      </Screen>
    );
  }

  const inWishlist = wishlistIds.includes(product._id);

  return (
    <Screen>
      <Image source={{ uri: product.imageUrls[0] }} style={styles.image} />
      <PureVegBadge />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>{formatPrice(activeVariant.price)}</Text>

      <SectionHeader title="Size / weight" />
      <View style={styles.chipRow}>
        {product.variants.map((variant) => (
          <Pressable
            key={variant._id ?? variant.value}
            onPress={() => setVariantId(variant._id ?? variant.value)}
            style={[styles.variantChip, variantId === (variant._id ?? variant.value) && styles.variantChipActive]}
          >
            <Text style={styles.variantLabel}>{variant.label}</Text>
            <Text style={styles.variantPrice}>{formatPrice(variant.price)}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Ingredients" subtitle="We proudly disclose what goes into every item." />
      <View style={styles.tagWrap}>
        {product.ingredients.map((ingredient) => (
          <Text key={ingredient} style={styles.tag}>{ingredient}</Text>
        ))}
      </View>

      {product.addOns.length > 0 ? (
        <>
          <SectionHeader title="Add-ons" subtitle="Optional extras to make it even better." />
          <View style={styles.tagWrap}>
            {product.addOns.map((addOn) => {
              const active = selectedAddOnIds.includes(addOn._id ?? '');
              return (
                <Text
                  key={addOn._id}
                  onPress={() =>
                    setSelectedAddOnIds((curr) =>
                      active ? curr.filter((id) => id !== addOn._id) : [...curr, addOn._id ?? '']
                    )
                  }
                  style={[styles.tag, active && styles.tagActive]}
                >
                  {addOn.name} +{formatPrice(addOn.price)}
                </Text>
              );
            })}
          </View>
        </>
      ) : null}

      <SectionHeader title="Reviews" />
      <Text style={styles.reviewSummary}>★ {product.rating.toFixed(1)} · {product.reviewCount} ratings</Text>

      <View style={styles.footerRow}>
        <View style={styles.qtyRow}>
          <Text onPress={() => setQuantity((v) => Math.max(1, v - 1))} style={styles.qtyBtn}>−</Text>
          <Text style={styles.qtyVal}>{quantity}</Text>
          <Text onPress={() => setQuantity((v) => v + 1)} style={styles.qtyBtn}>+</Text>
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            label="Add to cart"
            onPress={() => {
              dispatch(addToCart({ product, variantId: activeVariant._id ?? activeVariant.value, quantity, addOnIds: selectedAddOnIds }));
              success(`${product.name} added to cart.`);
            }}
          />
        </View>
      </View>

      <PrimaryButton
        variant="outline"
        label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        onPress={() => {
          dispatch(toggleWishlist(product._id));
          if (!inWishlist) success('Saved to your wishlist.');
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', height: 256, borderRadius: customerTheme.radius.lg },
  name: { ...t.display, color: customerTheme.colors.text },
  description: { ...t.body, color: customerTheme.colors.textMuted },
  price: { ...t.price, fontSize: 24, color: customerTheme.colors.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: customerTheme.radius.md,
    borderWidth: 1.5,
    borderColor: customerTheme.colors.border,
    backgroundColor: customerTheme.colors.surface,
    gap: 4
  },
  variantChipActive: { borderColor: customerTheme.colors.primary },
  variantLabel: { ...t.label, color: customerTheme.colors.text },
  variantPrice: { ...t.caption, color: customerTheme.colors.textMuted },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    ...t.caption,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: customerTheme.colors.mutedSurface,
    color: customerTheme.colors.textMuted
  },
  tagActive: { backgroundColor: '#E9F7EE', color: customerTheme.colors.primary },
  reviewSummary: { ...t.body, color: customerTheme.colors.textMuted },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    ...t.label,
    width: 38,
    height: 38,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 19,
    backgroundColor: customerTheme.colors.surface,
    color: customerTheme.colors.primary,
    fontSize: 20
  },
  qtyVal: { ...t.label, fontSize: 17, color: customerTheme.colors.text, minWidth: 24, textAlign: 'center' }
});
