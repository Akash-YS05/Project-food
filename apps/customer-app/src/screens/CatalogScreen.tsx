import { brand } from '@bambam/shared';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useAppSelector } from '../store';
import { customerTheme, type as t } from '../theme';

const categories = ['all', 'cakes', 'pizza', 'burger'] as const;

export const CatalogScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const products = useAppSelector((state) => state.catalog.products);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [category, products, query]
  );

  return (
    <Screen>
      <SectionHeader title="Pure Veg Menu" subtitle="All items are crafted in a 100% vegetarian kitchen." />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by item name"
        placeholderTextColor={customerTheme.colors.textMuted}
        style={styles.search}
      />
      <View style={styles.filterRow}>
        {categories.map((item) => (
          <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>
              {item === 'all' ? 'All' : brand.categoryLabels[item]}
            </Text>
          </Pressable>
        ))}
      </View>
      {filtered.length === 0 ? (
        <Text style={styles.empty}>No items match your search.</Text>
      ) : (
        filtered.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onPress={() => navigation.navigate('ProductDetails', { productId: product._id })}
          />
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  search: {
    ...t.input,
    borderRadius: customerTheme.radius.md,
    backgroundColor: customerTheme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: customerTheme.colors.text
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: customerTheme.radius.pill,
    backgroundColor: customerTheme.colors.mutedSurface
  },
  chipActive: { backgroundColor: '#E9F7EE' },
  chipText: { ...t.label, color: customerTheme.colors.textMuted },
  chipTextActive: { color: customerTheme.colors.primary },
  empty: { ...t.body, color: customerTheme.colors.textMuted, textAlign: 'center', paddingVertical: 32 }
});
