import { useContext, useState } from 'react';
import {
  Alert,
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
import Avatar from '../components/Avatar';
import { colors, validateEmail, validateName } from '../theme';

const NOTIFICATION_OPTIONS = [
  { key: 'orderStatuses', label: 'Order statuses' },
  { key: 'passwordChanges', label: 'Password changes' },
  { key: 'specialOffers', label: 'Special offers' },
  { key: 'newsletter', label: 'Newsletter' },
];

// US phone number: 10 digits, e.g. (217) 555-0113
const validatePhone = (phone) => phone.trim() === '' || /^\D*(\d\D*){10}$/.test(phone);

function Checkbox({ label, checked, onToggle }) {
  return (
    <Pressable
      style={styles.checkboxRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} accessibilityLabel={label} {...inputProps} />
    </View>
  );
}

export default function ProfileScreen() {
  const { profile, saveProfile, logOut } = useContext(AuthContext);

  // A local copy of the profile that the user can edit before saving
  const [form, setForm] = useState(profile);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleNotification = (key) =>
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));

  const onSave = async () => {
    if (!form.firstName.trim() || !validateName(form.firstName)) {
      return Alert.alert('Check your data', 'Please enter a valid first name.');
    }
    if (form.lastName.trim() && !validateName(form.lastName)) {
      return Alert.alert('Check your data', 'Please enter a valid last name.');
    }
    if (!validateEmail(form.email)) {
      return Alert.alert('Check your data', 'Please enter a valid email.');
    }
    if (!validatePhone(form.phone)) {
      return Alert.alert('Check your data', 'Please enter a valid US phone number (10 digits).');
    }
    await saveProfile(form);
    Alert.alert('Saved', 'Your changes have been saved.');
  };

  const onDiscard = () => setForm(profile);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Personal information</Text>

        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarRow}>
          <Avatar firstName={form.firstName} lastName={form.lastName} size={72} />
        </View>

        <Field
          label="First name"
          value={form.firstName}
          onChangeText={(v) => update('firstName', v)}
          autoCapitalize="words"
        />
        <Field
          label="Last name"
          value={form.lastName}
          onChangeText={(v) => update('lastName', v)}
          autoCapitalize="words"
        />
        <Field
          label="Email"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Phone number"
          value={form.phone}
          onChangeText={(v) => update('phone', v)}
          keyboardType="phone-pad"
          placeholder="(217) 555-0113"
        />

        <Text style={styles.sectionTitle}>Email notifications</Text>
        {NOTIFICATION_OPTIONS.map((option) => (
          <Checkbox
            key={option.key}
            label={option.label}
            checked={!!form.notifications?.[option.key]}
            onToggle={() => toggleNotification(option.key)}
          />
        ))}

        <Pressable style={styles.logoutButton} onPress={logOut} accessibilityRole="button">
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <View style={styles.buttonsRow}>
          <Pressable style={styles.discardButton} onPress={onDiscard} accessibilityRole="button">
            <Text style={styles.discardText}>Discard changes</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={onSave} accessibilityRole="button">
            <Text style={styles.saveText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.dark, marginVertical: 12 },
  label: { fontSize: 13, color: colors.grey, marginBottom: 4, fontWeight: '600' },
  avatarRow: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.green,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.green },
  checkmark: { color: colors.white, fontWeight: '800' },
  checkboxLabel: { fontSize: 16, color: colors.dark },
  logoutButton: {
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: '#CC9A06',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: { fontSize: 17, fontWeight: '700', color: colors.dark },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  discardButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  discardText: { color: colors.green, fontWeight: '700' },
  saveButton: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveText: { color: colors.white, fontWeight: '700' },
});
