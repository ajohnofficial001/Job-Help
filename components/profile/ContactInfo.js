import React from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const ContactInfo = ({ 
  profileData, 
  setProfileData, 
  isEditing, 
  setIsEditing,
  validatePhoneNumber,
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
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 5,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    marginTop: SIZES.small,
  },
});

export default ContactInfo; 