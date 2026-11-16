import { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthContext } from '../AuthContext';
import { colors, validateEmail, validateName } from '../theme';

export default function OnboardingScreen() {
  const { saveProfile } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // The Next button is enabled only when both fields are filled in correctly
  const isFirstNameValid = firstName.trim().length > 0 && validateName(firstName);
  const isEmailValid = validateEmail(email);
  const canContinue = isFirstNameValid && isEmailValid;

  const onNext = async () => {
    if (!canContinue) return;
    await saveProfile({
      firstName: firstName.trim(),
      lastName: '',
      email: email.trim(),
      phone: '',
      notifications: {
        orderStatuses: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
      },
      onboardingCompleted: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.title}>Let us get to know you</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Tilly"
            autoCapitalize="words"
            textContentType="givenName"
            accessibilityLabel="First name"
          />
          {firstName.length > 0 && !isFirstNameValid && (
            <Text style={styles.error}>Please use letters only</Text>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tilly@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            accessibilityLabel="Email"
          />
          {email.length > 0 && !isEmailValid && (
            <Text style={styles.error}>Please enter a valid email</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={onNext}
          disabled={!canContinue}
          style={[styles.button, !canContinue && styles.buttonDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={[styles.buttonText, !canContinue && styles.buttonTextDisabled]}>Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flexGrow: 1 },
  hero: {
    backgroundColor: colors.green,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: { fontSize: 26, color: colors.white, fontWeight: '600', textAlign: 'center' },
  form: { padding: 24 },
  label: { fontSize: 18, color: colors.dark, marginTop: 16, marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { color: '#C0392B', marginTop: 4 },
  footer: { backgroundColor: colors.light, padding: 24, alignItems: 'flex-end' },
  button: {
    backgroundColor: colors.yellow,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonDisabled: { backgroundColor: colors.grey },
  buttonText: { fontSize: 18, fontWeight: '700', color: colors.dark },
  buttonTextDisabled: { color: colors.light },
});
