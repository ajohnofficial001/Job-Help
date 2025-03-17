import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

const PersonalInfoSection = ({ profileData, setProfileData, isEditing }) => {
  const { darkMode, colors } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: darkMode ? colors.text : COLORS.primary }]}>
        Personal Information
      </Text>
      
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
          First Name
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { 
                color: darkMode ? colors.text : COLORS.primary,
                borderColor: darkMode ? colors.textSecondary : COLORS.gray2
              }
            ]}
            value={profileData.firstName}
            onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
            placeholder="Enter your first name"
            placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: darkMode ? colors.text : COLORS.primary }]}>
            {profileData.firstName || 'Not specified'}
          </Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
          Last Name
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { 
                color: darkMode ? colors.text : COLORS.primary,
                borderColor: darkMode ? colors.textSecondary : COLORS.gray2
              }
            ]}
            value={profileData.lastName}
            onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
            placeholder="Enter your last name"
            placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: darkMode ? colors.text : COLORS.primary }]}>
            {profileData.lastName || 'Not specified'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    marginBottom: SIZES.small,
  },
  fieldContainer: {
    marginBottom: SIZES.small,
  },
  fieldLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },
  input: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderRadius: SIZES.small / 2,
    padding: SIZES.small,
  },
});

export default PersonalInfoSection; 