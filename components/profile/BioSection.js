import React from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const BioSection = ({ 
  profileData, 
  setProfileData, 
  isEditing, 
  setIsEditing,
  darkMode,
  colors
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
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
});

export default BioSection; 