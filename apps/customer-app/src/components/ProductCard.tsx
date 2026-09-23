import { Product } from '@bambam/shared';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { customerTheme, type as t } from '../theme';
import { formatPrice } from '../utils/format';
import { PureVegBadge } from './PureVegBadge';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <Image source={{ uri: product.imageUrls[0] }} style={styles.image} />
    <View style={styles.content}>
      <PureVegBadge />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{product.shortDescription}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>{formatPrice(product.variants[0]?.price ?? 0)}</Text>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: customerTheme.colors.surface,
    borderRadius: customerTheme.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  pressed: { opacity: 0.9 },
  image: { width: '100%', height: 176 },
  content: { padding: customerTheme.spacing.md, gap: 8 },
  name: { ...t.title, color: customerTheme.colors.text },
  description: { ...t.body, color: customerTheme.colors.textMuted },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { ...t.price, color: customerTheme.colors.primary },
  rating: { ...t.caption, color: customerTheme.colors.textMuted }
});
