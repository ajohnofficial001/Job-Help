import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, FONT, SIZES, SHADOWS, icons, images } from '../../constants';
import { ScreenHeaderBtn } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, signOut, updateProfile, uploadProfilePicture, isLoading } = useAuth();
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

  useEffect(() => {
    // If user data is available from auth context, update profile data
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        firstName: user.firstName || prevData.firstName,
        lastName: user.lastName || prevData.lastName,
        email: user.email || prevData.email,
        profilePicture: user.profilePicture || prevData.profilePicture
      }));
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
      experience: profileData.experience,
      profilePicture: profileData.profilePicture
    });

    if (result.success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
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
          onPress: async () => {
            try {
              const result = await signOut();
              
              if (result.success) {
                router.replace('/auth/signin');
              } else {
                Alert.alert('Error', result.error || 'Failed to sign out');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
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
    Alert.alert(
      "Add Experience",
      "Would you like to add a new work experience?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Add",
          onPress: () => {
            setProfileData({
              ...profileData,
              experience: [
                ...profileData.experience,
                {
                  id: Date.now().toString(),
                  company: '',
                  position: '',
                  duration: '',
                  description: '',
                  isBold: false
                }
              ]
            });
            setIsEditing(true);
          }
        }
      ]
    );
  };

  const handleRemoveExperience = (id) => {
    const updatedExperience = profileData.experience.filter(exp => exp.id !== id);
    setProfileData({
      ...profileData,
      experience: updatedExperience
    });
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
    
    setProfileData({
      ...profileData,
      experience: updatedExperience
    });
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Determine the profile image source
  const profileImageSource = profileData.profilePicture 
    ? { uri: profileData.profilePicture } 
    : images.profile;

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
                style={[styles.headerButton, { marginRight: 10 }]}
                onPress={toggleDarkMode}
              >
                <Text style={styles.headerButtonText}>
                  {darkMode ? '☀️' : '🌙'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.headerButtonText}>
                    {isEditing ? 'Save' : 'Edit'}
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
        style={{ backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}
      >
        <View style={[
          styles.container, 
          { backgroundColor: darkMode ? colors.background : COLORS.lightWhite }
        ]}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={handleUploadPhoto}
            >
              <Image 
                source={profileImageSource} 
                style={styles.profileImage}
              />
              <View style={styles.uploadIconContainer}>
                <Text style={styles.uploadIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            {isEditing ? (
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={[
                    styles.nameInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.firstName}
                  onChangeText={(text) => setProfileData({...profileData, firstName: text})}
                  placeholder="First Name"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
                <TextInput
                  style={[
                    styles.nameInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.lastName}
                  onChangeText={(text) => setProfileData({...profileData, lastName: text})}
                  placeholder="Last Name"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
              </View>
            ) : (
              <Text style={[
                styles.profileName,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                {profileData.firstName} {profileData.lastName}
              </Text>
            )}
            <Text style={[
              styles.profileLocation,
              { color: darkMode ? colors.textSecondary : COLORS.gray }
            ]}>
              <Image 
                source={icons.location} 
                style={[
                  styles.locationIcon,
                  { tintColor: darkMode ? colors.textSecondary : COLORS.gray }
                ]} 
              />
              {' '}{profileData.location}
            </Text>
          </View>

          {/* Profile Info */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                Contact Information
              </Text>
              {!isEditing && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Email:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({...profileData, email: text})}
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.email || 'Add your email'}
                </Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Phone:
              </Text>
              {isEditing ? (
                <View style={{ width: '70%' }}>
                  <TextInput
                    style={[
                      styles.infoInput,
                      { 
                        color: darkMode ? colors.text : COLORS.primary,
                        borderColor: validatePhoneNumber(profileData.phone) || !profileData.phone ? 
                          COLORS.gray2 : COLORS.tertiary
                      }
                    ]}
                    value={profileData.phone}
                    onChangeText={(text) => setProfileData({...profileData, phone: text})}
                    keyboardType="phone-pad"
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                  {profileData.phone && !validatePhoneNumber(profileData.phone) && (
                    <Text style={styles.errorText}>Please enter a valid phone number</Text>
                  )}
                </View>
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.phone || 'Add your phone number'}
                </Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Location:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.location}
                  onChangeText={(text) => setProfileData({...profileData, location: text})}
                  placeholder="e.g. New York, NY"
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.location || 'Add your location'}
                </Text>
              )}
            </View>
          </View>

          {/* Education */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                Education
              </Text>
              {!isEditing && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                School:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.education.school}
                  onChangeText={(text) => setProfileData({
                    ...profileData, 
                    education: {...profileData.education, school: text}
                  })}
                  placeholder="e.g. University of California"
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.education.school || 'Add your school'}
                </Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Major:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.education.major}
                  onChangeText={(text) => setProfileData({
                    ...profileData, 
                    education: {...profileData.education, major: text}
                  })}
                  placeholder="e.g. Computer Science"
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.education.major || 'Add your major'}
                </Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Classification:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.education.classification}
                  onChangeText={(text) => setProfileData({
                    ...profileData, 
                    education: {...profileData.education, classification: text}
                  })}
                  placeholder="e.g. Senior, Junior, Sophomore"
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.education.classification || 'Add your classification'}
                </Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={[
                styles.infoLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Graduation:
              </Text>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.infoInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={profileData.education.graduationYear}
                  onChangeText={(text) => setProfileData({
                    ...profileData, 
                    education: {...profileData.education, graduationYear: text}
                  })}
                  placeholder="e.g. 2024"
                  keyboardType="number-pad"
                />
              ) : (
                <Text style={[
                  styles.infoValue,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}>
                  {profileData.education.graduationYear || 'Add graduation year'}
                </Text>
              )}
            </View>
          </View>

          {/* Bio */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                About Me
              </Text>
              {!isEditing && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            {isEditing ? (
              <TextInput
                style={[
                  styles.bioInput,
                  { 
                    color: darkMode ? colors.text : COLORS.secondary,
                    borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                  }
                ]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({...profileData, bio: text})}
                multiline
                placeholder="Tell us about yourself..."
              />
            ) : (
              <Text style={[
                styles.bioText,
                { color: darkMode ? colors.text : COLORS.secondary }
              ]}>
                {profileData.bio || 'Add information about yourself'}
              </Text>
            )}
          </View>

          {/* Skills */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                Skills
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleAddSkill}
              >
                <Text style={styles.editButtonText}>Add Skill</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <View key={index} style={[
                    styles.skillBadge,
                    { backgroundColor: darkMode ? COLORS.tertiary + '40' : COLORS.tertiary + '20' }
                  ]}>
                    <Text style={styles.skillText}>{skill}</Text>
                    {isEditing && (
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => handleRemoveSkill(index)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[
                  styles.emptyText,
                  { color: darkMode ? colors.textSecondary : COLORS.gray }
                ]}>
                  Add your skills to showcase your abilities
                </Text>
              )}
            </View>
          </View>

          {/* Experience */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: darkMode ? colors.text : COLORS.primary }
              ]}>
                Experience
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleAddExperience}
              >
                <Text style={styles.editButtonText}>Add Experience</Text>
              </TouchableOpacity>
            </View>
            {profileData.experience.length > 0 ? (
              profileData.experience.map((exp) => (
                <View key={exp.id} style={[
                  styles.experienceItem,
                  { borderBottomColor: darkMode ? colors.textSecondary : COLORS.gray2 }
                ]}>
                  {isEditing ? (
                    <>
                      <TextInput
                        style={[
                          styles.experienceInput,
                          { color: darkMode ? colors.text : COLORS.primary }
                        ]}
                        value={exp.company}
                        onChangeText={(text) => handleUpdateExperience(exp.id, 'company', text)}
                        placeholder="Company name"
                      />
                      <TextInput
                        style={[
                          styles.experienceInput,
                          { color: darkMode ? colors.textSecondary : COLORS.secondary }
                        ]}
                        value={exp.position}
                        onChangeText={(text) => handleUpdateExperience(exp.id, 'position', text)}
                        placeholder="Position"
                      />
                      <TextInput
                        style={[
                          styles.experienceInput,
                          { color: darkMode ? colors.textSecondary : COLORS.gray }
                        ]}
                        value={exp.duration}
                        onChangeText={(text) => handleUpdateExperience(exp.id, 'duration', text)}
                        placeholder="Duration (e.g. 2020 - Present)"
                      />
                      <TextInput
                        style={[
                          styles.experienceDescription,
                          { 
                            color: darkMode ? colors.text : COLORS.primary,
                            borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                          }
                        ]}
                        value={exp.description}
                        onChangeText={(text) => handleUpdateExperience(exp.id, 'description', text)}
                        placeholder="Add bullet points for your responsibilities and achievements..."
                        multiline
                        numberOfLines={4}
                      />
                      <View style={styles.experienceActions}>
                        <TouchableOpacity 
                          style={styles.removeExperienceButton}
                          onPress={() => handleRemoveExperience(exp.id)}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.boldButton}
                          onPress={() => handleUpdateExperience(exp.id, 'isBold', !exp.isBold)}
                        >
                          <Text style={styles.boldButtonText}>Bold</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={[
                        styles.companyName,
                        { color: darkMode ? colors.text : COLORS.primary }
                      ]}>
                        {exp.company || 'Company name'}
                      </Text>
                      <Text style={[
                        styles.positionText,
                        { color: darkMode ? colors.textSecondary : COLORS.secondary }
                      ]}>
                        {exp.position || 'Position'}
                      </Text>
                      <Text style={[
                        styles.durationText,
                        { color: darkMode ? colors.textSecondary : COLORS.gray }
                      ]}>
                        {exp.duration || 'Duration'}
                      </Text>
                      {exp.description && (
                        <Text style={[
                          styles.descriptionText,
                          exp.isBold && styles.boldText,
                          { color: darkMode ? colors.text : COLORS.primary }
                        ]}>
                          {exp.description}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              ))
            ) : (
              <Text style={[
                styles.emptyText,
                { color: darkMode ? colors.textSecondary : COLORS.gray }
              ]}>
                Add your work experience
              </Text>
            )}
          </View>

          {/* Settings */}
          <View style={[
            styles.section,
            { backgroundColor: darkMode ? colors.surface : COLORS.white }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: darkMode ? colors.text : COLORS.primary }
            ]}>
              Settings
            </Text>
            
            <View style={styles.settingItem}>
              <Text style={[
                styles.settingLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Push Notifications
              </Text>
              <Switch
                trackColor={{ false: COLORS.gray2, true: COLORS.tertiary }}
                thumbColor={notificationsEnabled ? COLORS.lightWhite : COLORS.white}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                value={notificationsEnabled}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={[
                styles.settingLabel,
                { color: darkMode ? colors.textSecondary : COLORS.secondary }
              ]}>
                Dark Mode
              </Text>
              <Switch
                trackColor={{ false: COLORS.gray2, true: COLORS.tertiary }}
                thumbColor={darkMode ? COLORS.lightWhite : COLORS.white}
                onValueChange={toggleDarkMode}
                value={darkMode}
              />
            </View>

            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: COLORS.tertiary }]}
              onPress={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.logoutButtonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Skills Modal */}
      <Modal
        visible={showSkillsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: darkMode ? colors.text : COLORS.primary }]}>
                Select Skills
              </Text>
              <TouchableOpacity onPress={() => setShowSkillsModal(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableSkills}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.skillItem,
                    selectedSkills.includes(item) && styles.selectedSkillItem,
                    { backgroundColor: darkMode ? colors.surface : COLORS.white }
                  ]}
                  onPress={() => handleSkillSelection(item)}
                >
                  <Text style={[
                    styles.skillItemText,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}>
                    {item}
                  </Text>
                  {selectedSkills.includes(item) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSkills}
            >
              <Text style={styles.saveButtonText}>Save Skills</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SIZES.medium,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.tertiary,
  },
  uploadIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.tertiary,
  },
  uploadIcon: {
    fontSize: 20,
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: SIZES.small / 2,
  },
  profileName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small / 2,
  },
  nameInput: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small / 2,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 5,
    width: '40%',
    marginHorizontal: 5,
  },
  profileLocation: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.gray,
  },
  section: {
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  infoLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    width: '30%',
  },
  infoValue: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    width: '70%',
  },
  infoInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 5,
  },
  bioText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    lineHeight: 22,
  },
  bioInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    height: 100,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.medium,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  skillText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
  },
  experienceItem: {
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  companyName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginBottom: 2,
  },
  positionText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  durationText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  settingLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  logoutButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  logoutButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  editButton: {
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
  },
  editButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SIZES.small,
  },
  removeButton: {
    marginLeft: SIZES.small / 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  removeExperienceButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    marginTop: SIZES.small,
  },
  experienceInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 5,
    marginBottom: SIZES.small / 2,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    marginTop: SIZES.small,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  closeButton: {
    fontSize: SIZES.xLarge,
    color: COLORS.tertiary,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  selectedSkillItem: {
    backgroundColor: COLORS.tertiary + '20',
  },
  skillItemText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  checkmark: {
    color: COLORS.tertiary,
    fontSize: SIZES.large,
  },
  saveButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  saveButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  experienceDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginTop: SIZES.small,
    textAlignVertical: 'top',
    height: 100,
  },
  experienceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.small,
  },
  boldButton: {
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    marginLeft: SIZES.small,
  },
  boldButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
  },
  descriptionText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    marginTop: SIZES.small,
  },
  boldText: {
    fontFamily: FONT.bold,
  },
});

export default ProfileScreen; 