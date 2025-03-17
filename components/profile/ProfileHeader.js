import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  TextInput,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES, icons, images } from '../../constants';

const ProfileHeader = ({ 
  profileData, 
  setProfileData, 
  isEditing, 
  handleUploadPhoto,
  darkMode,
  colors
}) => {
  // Determine the profile image source
  const profileImageSource = profileData.profilePicture 
    ? { uri: profileData.profilePicture } 
    : images.profile;

  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileHeader; 