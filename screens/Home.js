import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, imageUrl, MENU_KEY, MENU_URL } from '../theme';

const CATEGORIES = ['starters', 'mains', 'desserts', 'drinks'];

// Small hook that waits until the user stops typing before searching
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function HomeScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const searchText = useDebounce(query);

  // Load the menu: first from the local cache, otherwise from the server
  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(MENU_KEY);
        if (cached) {
          setMenu(JSON.parse(cached));
          return;
        }
        const response = await fetch(MENU_URL);
        const json = await response.json();
        const items = json.menu.map((item, index) => ({ id: String(index), ...item }));
        setMenu(items);
        await AsyncStorage.setItem(MENU_KEY, JSON.stringify(items));
      } catch (e) {
        setError('Could not load the menu. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleCategory = (category) =>
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  // Filter by the selected categories and by the search text
  const filteredMenu = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return menu.filter(
      (item) =>
        (selected.length === 0 || selected.includes(item.category)) &&
        item.name.toLowerCase().includes(text)
    );
  }, [menu, selected, searchText]);

  const header = (
    <View>
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <View style={styles.heroRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes
              served with a modern twist.
            </Text>
          </View>
          <Image
            source={{ uri: imageUrl('bruschetta.jpg') }}
            style={styles.heroImage}
            accessibilityLabel="Bruschetta dish"
          />
        </View>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu"
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
            accessibilityLabel="Search menu"
          />
        </View>
      </View>

      {/* MENU BREAKDOWN SECTION */}
      <View style={styles.breakdown}>
        <Text style={styles.breakdownTitle}>ORDER FOR DELIVERY!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((category) => {
            const active = selected.includes(category);
            return (
              <Pressable
                key={category}
                onPress={() => toggleCategory(category)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {loading && <ActivityIndicator style={{ marginTop: 24 }} color={colors.green} />}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FOOD MENU LIST SECTION */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id ?? item.name}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          !loading && !error ? <Text style={styles.empty}>No dishes found</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
            </View>
            <Image source={{ uri: imageUrl(item.image) }} style={styles.itemImage} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: { backgroundColor: colors.green, padding: 16 },
  heroTitle: { color: colors.yellow, fontSize: 40, fontWeight: '600' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroSubtitle: { color: colors.white, fontSize: 26, marginBottom: 8 },
  heroText: { color: colors.white, fontSize: 15, lineHeight: 21 },
  heroImage: { width: 120, height: 130, borderRadius: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 22, color: colors.dark, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
  breakdown: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  breakdownTitle: { fontSize: 18, fontWeight: '800', color: colors.dark, marginBottom: 12 },
  chip: {
    backgroundColor: colors.light,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  chipActive: { backgroundColor: colors.green },
  chipText: { color: colors.green, fontWeight: '700', fontSize: 15 },
  chipTextActive: { color: colors.white },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  itemName: { fontSize: 18, fontWeight: '700', color: colors.dark, marginBottom: 6 },
  itemDescription: { fontSize: 15, color: colors.green, marginBottom: 6 },
  itemPrice: { fontSize: 16, fontWeight: '600', color: colors.green },
  itemImage: { width: 90, height: 90, borderRadius: 4, backgroundColor: colors.light },
  separator: { height: 1, backgroundColor: colors.light, marginHorizontal: 16 },
  empty: { textAlign: 'center', marginTop: 24, color: colors.grey },
  error: { textAlign: 'center', margin: 16, color: '#C0392B' },
});
