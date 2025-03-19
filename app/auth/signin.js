import { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, FONT, SIZES, SHADOWS, icons, images } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SignIn = () => {
  const router = useRouter();
  const { signIn, forgotPassword, isLoading } = useAuth();
  const { darkMode, colors, toggleDarkMode } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      const result = await signIn(email, password);
      
      if (result.success) {
        router.replace('/');
      } else {
        Alert.alert(
          'Sign In Failed', 
          result.error || 'Invalid credentials',
          [
            { 
              text: 'Try Again', 
              style: 'cancel' 
            },
            { 
              text: 'Create Account', 
              onPress: () => router.push('/auth/signup')
            }
          ]
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    const result = await forgotPassword(email);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to send password reset email');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: darkMode ? colors.background : COLORS.lightWhite },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={toggleDarkMode}
            >
              <Text style={styles.themeToggleText}>
                {darkMode ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />

      <View style={[styles.container, { backgroundColor: darkMode ? colors.background : COLORS.lightWhite }]}>
        <View style={styles.formWrapper}>
          <View style={styles.logoContainer}>
            <Image 
              source={images.profile} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, { color: darkMode ? colors.text : COLORS.primary }]}>NextUp</Text>
          </View>

          <Text style={[styles.title, { color: darkMode ? colors.text : COLORS.primary }]}>Sign In</Text>
          <Text style={[styles.subtitle, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
            Welcome back! Please sign in to continue
          </Text>

          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: darkMode ? colors.textSecondary : COLORS.secondary }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
              <TextInput
                style={[styles.input, { color: darkMode ? colors.text : COLORS.primary }]}
                placeholder="Enter your email"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={[
              styles.label, 
              { marginTop: SIZES.medium, color: darkMode ? colors.textSecondary : COLORS.secondary }
            ]}>
              Password
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
              <TextInput
                style={[styles.input, { color: darkMode ? colors.text : COLORS.primary }]}
                placeholder="Enter your password"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Text>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                Don't have an account? 
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    ...SHADOWS.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: SIZES.small,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.large,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: SIZES.small,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: SIZES.small / 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    height: 50,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    height: '100%',
  },
  eyeIcon: {
    padding: SIZES.small,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: SIZES.small,
    marginBottom: SIZES.large,
  },
  forgotPasswordText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
  },
  signInButton: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  signInButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  signUpText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  signUpLink: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    marginLeft: 5,
  },
  themeToggle: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    marginRight: SIZES.small,
  },
  themeToggleText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});

export default SignIn; 