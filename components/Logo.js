import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// Horizontal Little Lemon logo used in every screen header
export default function Logo() {
  return (
    <View style={styles.row} accessibilityLabel="Little Lemon logo">
      <Image source={require('../assets/lemon.png')} style={styles.lemon} resizeMode="contain" />
      <Text style={styles.text}>LITTLE LEMON</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  lemon: { width: 22, height: 34, marginRight: 8 },
  text: { fontSize: 20, fontWeight: '700', letterSpacing: 3, color: colors.green },
});
