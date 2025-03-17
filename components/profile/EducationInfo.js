import React from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const EducationInfo = ({ 
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
});

export default EducationInfo; 