import { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, SIZES, SHADOWS, icons, FONT, images } from '../../constants';
import { ScreenHeaderBtn } from '../../components';
import {
  ProfileHeader,
  ContactInfo,
  EducationInfo,
  BioSection,
  SkillsSection,
  ExperienceSection,
  SettingsSection,
  SkillsModal,
  ResumeSection
} from '../../components/profile';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, signOut, updateProfile, uploadProfilePicture, uploadResume, downloadResume, deleteResume, isLoading } = useAuth();
  const { darkMode, colors, toggleDarkMode } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    education: {
      school: '',
      major: '',
      classification: '',
      graduationYear: ''
    },
    skills: [],
    experience: [],
    profilePicture: null
  });
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Predefined list of skills
  const availableSkills = [
    // Technical Skills
    'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'HTML/CSS', 'React', 'Node.js',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'REST APIs', 'GraphQL', 'MongoDB',
    'PostgreSQL', 'Redis', 'TypeScript', 'Angular', 'Vue.js', 'Flutter',
    // Non-Technical Skills
    'Project Management', 'Agile/Scrum', 'Leadership', 'Communication',
    'Problem Solving', 'Team Management', 'Strategic Planning', 'Business Analysis',
    'Data Analysis', 'Marketing', 'Sales', 'Customer Service', 'Public Speaking',
    'Time Management', 'Conflict Resolution', 'Negotiation', 'Creative Thinking'
  ];

  // Add a useEffect to log profileData changes
  useEffect(() => {
    console.log('Profile data updated:', { 
      ...profileData, 
      resume: profileData.resume ? { 
        ...profileData.resume, 
        base64: profileData.resume.base64 ? 'base64_content_truncated' : null 
      } : null 
    });
  }, [profileData]);

  useEffect(() => {
    // If user data is available from auth context, update profile data
    if (user) {
      setProfileData(prevData => {
        // Migrate existing experience data to new format if needed
        let updatedExperience = user.experience || prevData.experience || [];
        
        // Convert any old format experiences to new format
        updatedExperience = updatedExperience.map(exp => {
          // If this is an old format experience with duration but no start/end dates
          if (exp.duration && (!exp.startDate && !exp.endDate)) {
            // Try to parse duration into start and end dates
            const durationParts = exp.duration.split(' - ');
            return {
              ...exp,
              startDate: durationParts[0] || '',
              endDate: durationParts.length > 1 ? durationParts[1] : 'Present',
              location: exp.location || ''
            };
          }
          
          // Ensure all experiences have the required fields
          return {
            ...exp,
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            location: exp.location || '',
            isBold: exp.isBold || false
          };
        });
        
        return {
        ...prevData,
        firstName: user.firstName || prevData.firstName,
        lastName: user.lastName || prevData.lastName,
        email: user.email || prevData.email,
          phone: user.phone || prevData.phone,
          location: user.location || prevData.location,
          bio: user.bio || prevData.bio,
          education: user.education || prevData.education,
          skills: user.skills || prevData.skills || [],
          experience: updatedExperience,
          profilePicture: user.profilePicture || prevData.profilePicture,
          resume: user.resume || prevData.resume
        };
      });
    } else {
      // If no user is logged in, redirect to sign-in page
      router.replace('/auth/signin');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Validate phone number if provided
    if (profileData.phone && !validatePhoneNumber(profileData.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return;
    }
    
    // Validate required fields in experiences
    if (profileData.experience && profileData.experience.length > 0) {
      // Validate date format for all experiences
      const validateDateFormat = (date) => {
        if (!date) return true; // Empty is allowed for end date
        if (date.toLowerCase() === 'present') return true;
        
        const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
        return dateRegex.test(date);
      };
      
      // Check for any invalid experiences
      const invalidExperiences = profileData.experience.filter(exp => {
        if (!exp.company || !exp.startDate || !exp.location) {
          return true;
        }
        
        if (!validateDateFormat(exp.startDate)) {
          return true;
        }
        
        if (exp.endDate && !validateDateFormat(exp.endDate)) {
          return true;
        }
        
        return false;
      });
      
      if (invalidExperiences.length > 0) {
        Alert.alert(
          'Validation Error', 
          'Please ensure all experiences have valid Company Name, Start Date (MM/YYYY), and Location.'
        );
        return;
      }
    }
    
    try {
    // Save all profile data
    const result = await updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio,
      education: profileData.education,
      skills: profileData.skills,
        experience: profileData.experience || [], // Ensure experience is always an array
        profilePicture: profileData.profilePicture,
        resume: profileData.resume // Include resume data when saving
    });

    if (result.success) {
      setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully. All experiences have been saved.');
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while saving your profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Sign Out", 
          onPress: () => {
            // Navigate to sign-in page immediately
                router.replace('/auth/signin');
            
            // Then perform sign out
            signOut();
          }
        }
      ]
    );
  };

  const handleUploadPhoto = async () => {
    try {
      const result = await uploadProfilePicture();
      
      if (result.success) {
        setProfileData(prevData => ({
          ...prevData,
          profilePicture: result.uri
        }));
        Alert.alert('Success', 'Profile picture updated successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddSkill = () => {
    setSelectedSkills([...profileData.skills]);
    setShowSkillsModal(true);
  };

  const handleSkillSelection = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSaveSkills = () => {
    setProfileData({
      ...profileData,
      skills: selectedSkills
    });
    setShowSkillsModal(false);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills.splice(index, 1);
    setProfileData({
      ...profileData,
      skills: updatedSkills
    });
  };

  const handleAddExperience = () => {
    // Create a new experience object with a unique ID
    const newExperience = {
                  id: Date.now().toString(),
                  company: '',
                  position: '',
      startDate: '',
      endDate: '',
      location: '',
                  description: '',
                  isBold: false
    };
    
    // Update the profile data with the new experience
    setProfileData(prevData => ({
      ...prevData,
      experience: [...(prevData.experience || []), newExperience]
    }));
    
    // Set editing mode to true so user can immediately edit the new experience
            setIsEditing(true);
  };

  const handleRemoveExperience = (id) => {
    // Make sure experience array exists
    if (!profileData.experience || !Array.isArray(profileData.experience)) {
      return;
    }
    
    const updatedExperience = profileData.experience.filter(exp => exp.id !== id);
    
    setProfileData(prevData => ({
      ...prevData,
      experience: updatedExperience
    }));
  };

  const handleUpdateExperience = (id, field, value) => {
    const updatedExperience = profileData.experience.map(exp => {
      if (exp.id === id) {
        return {
          ...exp,
          [field]: value
        };
      }
      return exp;
    });
    
    setProfileData(prevData => ({
      ...prevData,
      experience: updatedExperience
    }));
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Handle resume upload
  const handleUploadResume = async () => {
    console.log('Starting resume upload...');
    const result = await uploadResume();
    console.log('Upload resume result:', result);
    
    if (result.success) {
      console.log('Resume upload successful, updating profile data...');
      console.log('Current user after upload:', { 
        ...user, 
        resume: user.resume ? { ...user.resume, base64: 'base64_content_truncated' } : null 
      });
      
      // Update the local profileData state with the updated user data
      if (user && user.resume) {
        console.log('User has resume, updating profileData...');
        setProfileData(prevData => {
          const updatedData = {
            ...prevData,
            resume: user.resume
          };
          console.log('Updated profile data:', { 
            ...updatedData, 
            resume: { ...updatedData.resume, base64: 'base64_content_truncated' } 
          });
          return updatedData;
        });
      } else {
        console.log('User does not have resume after upload!');
      }
    } else {
      console.log('Resume upload failed:', result.error);
    }
  };
  
  // Handle resume download
  const handleDownloadResume = async () => {
    const result = await downloadResume();
    if (!result.success) {
      // The downloadResume function already shows error messages
      // No need for additional error handling here
    }
  };
  
  // Handle resume deletion
  const handleDeleteResume = async () => {
    Alert.alert(
      "Delete Resume",
      "Are you sure you want to delete your resume?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            const result = await deleteResume();
            if (result.success) {
              // Update the local profileData state to remove the resume
              setProfileData(prevData => {
                const { resume, ...dataWithoutResume } = prevData;
                return dataWithoutResume;
              });
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { 
            backgroundColor: darkMode ? colors.background : COLORS.lightWhite 
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn 
              iconUrl={icons.left} 
              dimension="60%" 
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={toggleDarkMode}
              >
                <Text style={styles.headerButtonText}>
                  {darkMode ? '☀️' : '🌙'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { marginLeft: 10 }]}
                onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.headerButtonText}>
                    {isEditing ? '💾' : '✏️'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}
      >
        <View style={[
          styles.container, 
          { backgroundColor: darkMode ? colors.background : COLORS.lightWhite }
        ]}>
          {/* Profile Header */}
          <ProfileHeader 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            handleUploadPhoto={handleUploadPhoto}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Contact Info */}
          <ContactInfo 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            validatePhoneNumber={validatePhoneNumber}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Education */}
          <EducationInfo 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Bio */}
          <BioSection 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Skills */}
          <SkillsSection 
            profileData={profileData}
            isEditing={isEditing}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Experience */}
          <ExperienceSection 
            profileData={profileData}
            isEditing={isEditing}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
            handleUpdateExperience={handleUpdateExperience}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Resume Section */}
          <ResumeSection 
            profileData={profileData}
            isEditing={isEditing}
            handleUploadResume={handleUploadResume}
            handleDownloadResume={handleDownloadResume}
            handleDeleteResume={handleDeleteResume}
            isLoading={isLoading}
            darkMode={darkMode}
            colors={colors}
          />

          {/* Settings */}
          <SettingsSection 
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            handleSignOut={handleSignOut}
            isLoading={isLoading}
            colors={colors}
          />
        </View>
      </ScrollView>

      {/* Skills Modal */}
      <SkillsModal 
        showSkillsModal={showSkillsModal}
        setShowSkillsModal={setShowSkillsModal}
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        handleSkillSelection={handleSkillSelection}
        handleSaveSkills={handleSaveSkills}
        darkMode={darkMode}
        colors={colors}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
  },
  headerButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
  },
  headerButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});

export default ProfileScreen; 