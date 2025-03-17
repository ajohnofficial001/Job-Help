import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
        const parsedUser = JSON.parse(storedUser);
        console.log('Stored user data:', parsedUser);
        setUser(parsedUser);
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
        const { password, ...userData } = userExists;
        
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
              profilePicture: userData.profilePicture || registeredUser.profilePicture,
              resume: userData.resume || registeredUser.resume
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
          profilePicture: userData.profilePicture || user.profilePicture,
          resume: userData.resume || user.resume
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

  const uploadResume = async () => {
    try {
      // Pick a PDF document
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return { success: false, error: 'Document picking was canceled' };
      }
      
      if (!result.assets || result.assets.length === 0) {
        return { success: false, error: 'No document selected' };
      }
      
      const document = result.assets[0];
      console.log('Selected document:', document);
      
      // Validate file type
      if (document.mimeType !== 'application/pdf') {
        Alert.alert('Invalid File', 'Please select a PDF file for your resume.');
        return { success: false, error: 'Invalid file type. Only PDF files are allowed.' };
      }
      
      // Validate file size (limit to 5MB)
      const fileInfo = await FileSystem.getInfoAsync(document.uri);
      if (fileInfo.size > 5 * 1024 * 1024) {
        Alert.alert('File Too Large', 'Resume file size should be less than 5MB.');
        return { success: false, error: 'File too large. Maximum size is 5MB.' };
      }
      
      // Read the file as base64
      const base64Content = await FileSystem.readAsStringAsync(document.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Update the resume in registered users
      if (user) {
        const resumeData = {
          name: document.name,
          uri: document.uri,
          base64: base64Content,
          size: fileInfo.size,
          uploadDate: new Date().toISOString()
        };
        
        console.log('Resume data being saved:', { ...resumeData, base64: 'base64_content_truncated' });
        
        const updatedUsers = registeredUsers.map((registeredUser) => {
          if (registeredUser.id === user.id) {
            return {
              ...registeredUser,
              resume: resumeData
            };
          }
          return registeredUser;
        });
        
        // Save the updated users
        await saveRegisteredUsers(updatedUsers);
        
        // Update the current user
        const updatedUser = {
          ...user,
          resume: resumeData
        };
        
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        console.log('User after resume upload:', { ...updatedUser, resume: { ...updatedUser.resume, base64: 'base64_content_truncated' } });
        
        Alert.alert('Success', 'Resume uploaded successfully.');
        return { success: true, fileName: document.name };
      }
      
      return { success: false, error: 'User not logged in' };
    } catch (error) {
      console.error('Error uploading resume:', error);
      Alert.alert('Error', 'Failed to upload resume. Please try again.');
      return { success: false, error: error.message || 'An error occurred' };
    }
  };

  const downloadResume = async () => {
    try {
      if (!user || !user.resume) {
        Alert.alert('No Resume', 'You have not uploaded a resume yet.');
        return { success: false, error: 'No resume found' };
      }
      
      // Create a temporary file path
      const fileUri = FileSystem.documentDirectory + user.resume.name;
      
      // Write the base64 content to a file
      await FileSystem.writeAsStringAsync(fileUri, user.resume.base64, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        return { success: true };
      } else {
        // Fallback for web or unsupported platforms
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return { success: false, error: 'Sharing not available' };
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download resume. Please try again.');
      return { success: false, error: error.message || 'An error occurred' };
    }
  };

  const deleteResume = async () => {
    try {
      if (!user || !user.resume) {
        Alert.alert('No Resume', 'You have not uploaded a resume yet.');
        return { success: false, error: 'No resume found' };
      }
      
      // Update the resume in registered users
      const updatedUsers = registeredUsers.map((registeredUser) => {
        if (registeredUser.id === user.id) {
          const { resume, ...userWithoutResume } = registeredUser;
          return userWithoutResume;
        }
        return registeredUser;
      });
      
      // Save the updated users
      await saveRegisteredUsers(updatedUsers);
      
      // Update the current user
      const { resume, ...userWithoutResume } = user;
      await AsyncStorage.setItem('currentUser', JSON.stringify(userWithoutResume));
      setUser(userWithoutResume);
      
      Alert.alert('Success', 'Resume deleted successfully.');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', 'Failed to delete resume. Please try again.');
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
    uploadResume,
    downloadResume,
    deleteResume
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 