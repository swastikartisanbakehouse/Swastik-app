import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwastikLogo } from '../../src/components/SwastikLogo';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../src/api/auth';
import { useAuthStore } from '../../src/store/authStore';
import { extractErrorMessage } from '../../src/api/client';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../src/theme';

const SERIF_FONT = Platform.select({ ios: 'Georgia', android: 'serif' });

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !validateEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    setIsLoading(true);
    try {
      const { token, user } = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });
      await setAuth(token, user);
      router.replace('/(tabs)');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact Swastik Artisan Bakehouse customer support or your branch manager to reset your password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top group: logo + hero */}
          <View style={styles.topGroup}>
            <View style={styles.logoArea}>
              <SwastikLogo size="lg" showTagline={true} />
            </View>

            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>One App. Endless Delights.</Text>
              <Text style={styles.heroSubtitle}>
                Order your favorite Bakery, Dairy,{'\n'}
                Sweets & Confectionery in a single order.
              </Text>
            </View>
          </View>

          {/* Middle group: form */}
          <View style={styles.middleGroup}>
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}> {error}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Email"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.gray500}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
              accessibilityLabel="Forgot Password"
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
              accessibilityLabel="Login"
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <View style={styles.arrowIconWrap}>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topGroup: {
    width: '100%',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 19,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 29,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.maroon,
    fontFamily: SERIF_FONT,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#555555',
    fontFamily: SERIF_FONT,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  middleGroup: {
    width: '100%',
    alignItems: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    flex: 1,
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
    width: '100%',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    textAlign: 'left',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotBtn: {
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 20,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.maroon,
    fontFamily: SERIF_FONT,
    textAlign: 'center',
  },
  loginBtn: {
    height: 52,
    width: '100%',
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: 16.5,
    fontWeight: '600',
    fontFamily: SERIF_FONT,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  arrowIconWrap: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 13.5,
    color: '#666666',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.maroon,
    fontFamily: SERIF_FONT,
    textAlign: 'center',
  },
});