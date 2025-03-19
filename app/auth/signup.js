import { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, FONT, SIZES, SHADOWS, icons, images } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SignUp = () => {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { darkMode, colors, toggleDarkMode } = useTheme();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // For testing purposes, simplify the password validation
    // At least 8 characters
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    console.log("Sign Up button pressed");
    let isValid = true;
    
    // Validate first name
    if (!firstName) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    
    // Validate last name
    if (!lastName) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }
    
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
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    console.log("Form validation result:", isValid);
    
    if (isValid) {
      console.log("Attempting to sign up with:", { firstName, lastName, email });
      try {
        const result = await signUp(firstName, lastName, email, password);
        console.log("Sign up result:", result);
        
        if (result.success) {
          // Show a brief toast or message
          Alert.alert('Account Created', 'Your account has been created successfully!');
          
          // Automatically navigate to sign-in page after a short delay
          setTimeout(() => {
            router.replace('/auth/signin');
          }, 1000);
        } else {
          Alert.alert('Sign Up Failed', result.error || 'Failed to create account');
        }
      } catch (error) {
        console.error("Sign up error:", error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: darkMode ? colors.background : COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}
              onPress={() => router.back()}
            >
              <Image 
                source={icons.left}
                style={[styles.backIcon, { tintColor: darkMode ? colors.text : COLORS.primary }]}
              />
            </TouchableOpacity>
          ),
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center',
          paddingVertical: SIZES.large
        }}
        style={{ backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}
      >
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

            <Text style={[styles.title, { color: darkMode ? colors.text : COLORS.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
              Sign up to get started with NextUp
            </Text>

            <View style={styles.formContainer}>
              <Text style={[styles.label, { color: darkMode ? colors.textSecondary : COLORS.secondary }]}>First Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
                <TextInput
                  style={[styles.input, { color: darkMode ? colors.text : COLORS.primary }]}
                  placeholder="Enter your first name"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

              <Text style={[
                styles.label, 
                { marginTop: SIZES.medium, color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Last Name
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
                <TextInput
                  style={[styles.input, { color: darkMode ? colors.text : COLORS.primary }]}
                  placeholder="Enter your last name"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

              <Text style={[
                styles.label, 
                { marginTop: SIZES.medium, color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Email
              </Text>
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
                  placeholder="Create a password"
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
              <Text style={[styles.passwordHint, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                Password must be at least 8 characters
              </Text>

              <Text style={[
                styles.label, 
                { marginTop: SIZES.medium, color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Confirm Password
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
                <TextInput
                  style={[styles.input, { color: darkMode ? colors.text : COLORS.primary }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  <Text>{isConfirmPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

              <TouchableOpacity 
                style={[styles.signUpButton, { opacity: isLoading ? 0.7 : 1 }]}
                onPress={handleSignUp}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={[styles.signInText, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                  Already have an account? 
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/signin')}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.small / 1.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
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
  passwordHint: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 5,
    marginBottom: SIZES.small,
  },
  signUpButton: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  signUpButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
    marginBottom: SIZES.small,
  },
  signInText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  signInLink: {
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

export default SignUp; 