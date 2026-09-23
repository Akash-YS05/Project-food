import { brand } from '@bambam/shared';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryCard } from '../components/CategoryCard';
import { InfoBanner } from '../components/InfoBanner';
import { ProductCard } from '../components/ProductCard';
import { PureVegBadge } from '../components/PureVegBadge';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { useAppSelector } from '../store';
import { customerTheme, type as t } from '../theme';

export const HomeScreen = ({ navigation }: any) => {
  const products = useAppSelector((state) => state.catalog.products);
  const trending = products.filter((item) => item.isTrending);
  const recommended = products.filter((item) => item.isRecommended);

  return (
    <Screen>
      <View style={styles.header}>
        <PureVegBadge />
        <Text style={styles.title}>{brand.appName}</Text>
        <Text style={styles.subtitle}>{brand.trustMessage}</Text>
      </View>
      <TextInput placeholder="Search cakes, pizza, burgers…" style={styles.search} placeholderTextColor={customerTheme.colors.textMuted} />
      <InfoBanner
        title="Fresh from the Pure Veg kitchen"
        message="Daily baked cakes, cheesy pizza, and satisfying burgers — crafted without egg or non-veg ingredients."
      />
      <SectionHeader title="Shop by category" subtitle="Pure veg favourites for every craving" />
      <View style={styles.categoryRow}>
        <CategoryCard label="Cakes" onPress={() => navigation.navigate('CatalogTab')} />
        <CategoryCard label="Pizza" onPress={() => navigation.navigate('CatalogTab')} />
        <CategoryCard label="Burger" onPress={() => navigation.navigate('CatalogTab')} />
      </View>
      {trending.length > 0 ? (
        <>
          <SectionHeader title="Trending now" subtitle="Best loved by Bam Bam customers" />
          {trending.map((product) => (
            <ProductCard key={product._id} product={product} onPress={() => navigation.navigate('ProductDetails', { productId: product._id })} />
          ))}
        </>
      ) : null}
      {recommended.length > 0 ? (
        <>
          <SectionHeader title="Recommended" subtitle="Premium veg picks with ingredient transparency" />
          {recommended.map((product) => (
            <ProductCard key={product._id} product={product} onPress={() => navigation.navigate('ProductDetails', { productId: product._id })} />
          ))}
        </>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { gap: 6 },
  title: { ...t.display, color: customerTheme.colors.text },
  subtitle: { ...t.body, color: customerTheme.colors.textMuted },
  search: {
    ...t.input,
    borderRadius: customerTheme.radius.md,
    backgroundColor: customerTheme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: customerTheme.colors.text
  },
  categoryRow: { flexDirection: 'row', gap: 12 }
});
