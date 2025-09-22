import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, FontSizes, Spacing } from '../constants/Theme';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsLoading(true);
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google authentication error:', error);
      Alert.alert('Error', error.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="home" size={48} color="#10b981" />
            </View>
            <Text style={styles.appName}>Namaz Mobile</Text>
            <Text style={styles.appSubtitle}>Islamic Prayer Companion</Text>
          </View>

          {/* Bismillah */}
          <View style={styles.bismillahContainer}>
            <Text style={styles.bismillahArabic}>
              بِسْمِ اللهِ الرّحمن الرّحيم
            </Text>
            <Text style={styles.bismillahEnglish}>
              In the name of Allah, the Most Gracious, the Most Merciful
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.formSubtitle}>
                {isLogin 
                  ? 'Sign in to continue your journey' 
                  : 'Join us to start your spiritual journey'
                }
              </Text>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#6b7280" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your full name"
                      placeholderTextColor="#6b7280"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.authButton, isLoading && styles.authButtonDisabled]}
                onPress={handleAuth}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.authButtonText}>
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleAuth}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={20} color="#4285f4" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
                disabled={isLoading}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Sign In"
                  }
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you'll get</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="time-outline" size={20} color="#10b981" />
                <Text style={styles.featureText}>Accurate prayer times</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="compass-outline" size={20} color="#10b981" />
                <Text style={styles.featureText}>Qibla direction finder</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="book-outline" size={20} color="#10b981" />
                <Text style={styles.featureText}>Learn Namaz step-by-step</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="heart-outline" size={20} color="#10b981" />
                <Text style={styles.featureText}>Islamic duas and hadith</Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
  },
  appSubtitle: {
    fontSize: FontSizes.md,
    color: '#94a3b8',
    textAlign: 'center',
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  bismillahArabic: {
    fontSize: FontSizes.xxl,
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  bismillahEnglish: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  formTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  formSubtitle: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    color: 'white',
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: 'white',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  authButton: {
    backgroundColor: '#10b981',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  authButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  authButtonText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    paddingHorizontal: Spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: Spacing.lg,
  },
  googleButtonText: {
    fontSize: FontSizes.md,
    color: 'white',
    marginLeft: Spacing.sm,
  },
  switchButton: {
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: FontSizes.sm,
    color: '#10b981',
  },
  featuresContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  featuresTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
  },
  featureText: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    marginLeft: Spacing.sm,
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});