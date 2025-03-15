import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    checkUserSession();
    // Load registered users from storage
    loadRegisteredUsers();
  }, []);

  const loadRegisteredUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('registeredUsers');
      if (storedUsers) {
        setRegisteredUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Error loading registered users:', error);
    }
  };

  const saveRegisteredUsers = async (users) => {
    try {
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
      setRegisteredUsers(users);
    } catch (error) {
      console.error('Error saving registered users:', error);
    }
  };

  const checkUserSession = async () => {
    // Check for a stored user session
    setIsLoading(true);
    
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    // Authenticate user
    setIsLoading(true);
    
    try {
      // Check if the user exists in registered users
      const userExists = registeredUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );
      
      if (userExists) {
        // Create a user object without the password
        const userData = {
          id: userExists.id,
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          email: userExists.email,
          profilePicture: userExists.profilePicture,
        };
        
        // Store the current user
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials or user does not exist' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (firstName, lastName, email, password) => {
    // Register a new user
    setIsLoading(true);
    
    try {
      // Check if all required fields are provided
      if (firstName && lastName && email && password) {
        // Check if the email is already registered
        const emailExists = registeredUsers.some(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
          return { success: false, error: 'Email is already registered' };
        }
        
        // Create a new user
        const newUser = {
          id: Date.now().toString(),
          firstName,
          lastName,
          email,
          password, // In a real app, this would be hashed
          profilePicture: null,
        };
        
        // Add the new user to registered users
        const updatedUsers = [...registeredUsers, newUser];
        await saveRegisteredUsers(updatedUsers);
        
        // Return success but don't automatically sign in
        return { success: true };
      } else {
        return { success: false, error: 'Please fill all fields' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // Sign out the user
    setIsLoading(true);
    
    try {
      // Clear the stored user
      await AsyncStorage.removeItem('currentUser');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    // Handle forgot password
    setIsLoading(true);
    
    try {
      // Check if the email exists in registered users
      const userExists = registeredUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        // In a real app, you would send a password reset email
        Alert.alert(
          'Password Reset',
          'If your email is registered with us, you will receive a password reset link shortly.'
        );
        return { success: true };
      } else {
        // Don't reveal if the email exists or not for security reasons
        Alert.alert(
          'Password Reset',
          'If your email is registered with us, you will receive a password reset link shortly.'
        );
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    // Update user profile
    setIsLoading(true);
    
    try {
      if (userData && user) {
        // Update the user in registered users
        const updatedUsers = registeredUsers.map((registeredUser) => {
          if (registeredUser.id === user.id) {
            return {
              ...registeredUser,
              firstName: userData.firstName || registeredUser.firstName,
              lastName: userData.lastName || registeredUser.lastName,
              email: userData.email || registeredUser.email,
              phone: userData.phone || registeredUser.phone,
              location: userData.location || registeredUser.location,
              bio: userData.bio || registeredUser.bio,
              education: userData.education || registeredUser.education,
              skills: userData.skills || registeredUser.skills || [],
              experience: userData.experience || registeredUser.experience || [],
              profilePicture: userData.profilePicture || registeredUser.profilePicture
            };
          }
          return registeredUser;
        });
        
        // Save the updated users
        await saveRegisteredUsers(updatedUsers);
        
        // Update the current user
        const updatedUser = {
          ...user,
          firstName: userData.firstName || user.firstName,
          lastName: userData.lastName || user.lastName,
          email: userData.email || user.email,
          phone: userData.phone || user.phone,
          location: userData.location || user.location,
          bio: userData.bio || user.bio,
          education: userData.education || user.education,
          skills: userData.skills || user.skills || [],
          experience: userData.experience || user.experience || [],
          profilePicture: userData.profilePicture || user.profilePicture
        };
        
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid data or user not logged in' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos to upload a profile picture.');
        return { success: false, error: 'Permission denied' };
      }
      
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Update the profile picture in registered users
        if (user) {
          const updatedUsers = registeredUsers.map((registeredUser) => {
            if (registeredUser.id === user.id) {
              return {
                ...registeredUser,
                profilePicture: result.assets[0].uri,
              };
            }
            return registeredUser;
          });
          
          // Save the updated users
          await saveRegisteredUsers(updatedUsers);
          
          // Update the current user
          const updatedUser = {
            ...user,
            profilePicture: result.assets[0].uri,
          };
          
          await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        return { success: true, uri: result.assets[0].uri };
      }
      
      return { success: false, error: 'No image selected' };
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updateProfile,
    uploadProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 