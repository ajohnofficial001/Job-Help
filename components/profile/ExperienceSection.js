import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { COLORS, FONT, SIZES, icons } from '../../constants';

// Individual Experience Item component
const ExperienceItem = ({ 
  exp, 
  isEditing, 
  handleRemoveExperience, 
  handleUpdateExperience,
  darkMode,
  colors
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Reset expanded state when global editing changes
  useEffect(() => {
    if (!isEditing) {
      setIsExpanded(false);
    }
  }, [isEditing]);
  
  // Validate date format (MM/YYYY)
  const validateDateFormat = (date) => {
    if (!date) return true; // Empty is allowed for end date
    if (date.toLowerCase() === 'present') return true; // Allow "Present" for end date
    
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(date);
  };
  
  // Toggle editing mode for this experience
  const toggleEdit = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Save and collapse this experience
  const saveExperience = () => {
    // Validate required fields
    if (!exp.company) {
      Alert.alert('Validation Error', 'Company Name is required.');
      return;
    }
    
    if (!exp.startDate) {
      Alert.alert('Validation Error', 'Start Date is required.');
      return;
    }
    
    if (!validateDateFormat(exp.startDate)) {
      Alert.alert('Validation Error', 'Start Date must be in MM/YYYY format (e.g., 01/2023).');
      return;
    }
    
    if (exp.endDate && !validateDateFormat(exp.endDate)) {
      Alert.alert('Validation Error', 'End Date must be in MM/YYYY format (e.g., 01/2023) or "Present".');
      return;
    }
    
    if (!exp.location) {
      Alert.alert('Validation Error', 'Location is required.');
      return;
    }
    
    // All validation passed, collapse this experience
    setIsExpanded(false);
  };
  
  return (
    <View style={[
      styles.experienceItem,
      { borderBottomColor: darkMode ? colors.textSecondary : COLORS.gray2 }
    ]}>
      {(isEditing || isExpanded) ? (
        // Editing mode
        <>
          <View style={styles.experienceHeader}>
            <View style={styles.companyLogoPlaceholder}>
              <Text style={styles.companyInitial}>🧠</Text>
            </View>
            <View style={styles.experienceEditFields}>
              <View style={styles.requiredFieldContainer}>
                <Text style={[
                  styles.fieldLabel,
                  { color: darkMode ? colors.textSecondary : COLORS.gray }
                ]}>
                  Company Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.experienceInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={exp.company}
                  onChangeText={(text) => handleUpdateExperience(exp.id, 'company', text)}
                  placeholder="Company name (required)"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
              </View>
              <TextInput
                style={[
                  styles.experienceInput,
                  { color: darkMode ? colors.textSecondary : COLORS.secondary }
                ]}
                value={exp.position}
                onChangeText={(text) => handleUpdateExperience(exp.id, 'position', text)}
                placeholder="Position/Title"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              />
            </View>
          </View>
          
          <View style={styles.experienceDetails}>
            <View style={styles.dateLocationContainer}>
              <View style={styles.dateContainer}>
                <Text style={[
                  styles.fieldLabel,
                  { color: darkMode ? colors.textSecondary : COLORS.gray }
                ]}>
                  Start Date <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.dateInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={exp.startDate || ''}
                  onChangeText={(text) => handleUpdateExperience(exp.id, 'startDate', text)}
                  placeholder="MM/YYYY (required)"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
              </View>
              
              <View style={styles.dateContainer}>
                <Text style={[
                  styles.fieldLabel,
                  { color: darkMode ? colors.textSecondary : COLORS.gray }
                ]}>
                  End Date
                </Text>
                <TextInput
                  style={[
                    styles.dateInput,
                    { color: darkMode ? colors.text : COLORS.primary }
                  ]}
                  value={exp.endDate || ''}
                  onChangeText={(text) => handleUpdateExperience(exp.id, 'endDate', text)}
                  placeholder="MM/YYYY or Present"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <Text style={[
                styles.fieldLabel,
                { color: darkMode ? colors.textSecondary : COLORS.gray }
              ]}>
                Location <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.locationInput,
                  { color: darkMode ? colors.text : COLORS.primary }
                ]}
                value={exp.location || ''}
                onChangeText={(text) => handleUpdateExperience(exp.id, 'location', text)}
                placeholder="City, State, Country (required)"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              />
            </View>
            
            <Text style={[
              styles.fieldLabel,
              { color: darkMode ? colors.textSecondary : COLORS.gray, marginTop: 10 }
            ]}>
              Description:
            </Text>
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
              placeholder="Describe your responsibilities and achievements..."
              multiline
              numberOfLines={4}
              placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
            />
            <Text style={[
              styles.descriptionNote,
              { color: darkMode ? colors.textSecondary : COLORS.gray }
            ]}>
              Use the B button to make your description text bold
            </Text>
          </View>
          
          <View style={styles.experienceActions}>
            <TouchableOpacity 
              style={styles.removeExperienceButton}
              onPress={() => handleRemoveExperience(exp.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity 
                style={[
                  styles.boldToggle,
                  exp.isBold && styles.boldToggleActive
                ]}
                onPress={() => {
                  const newValue = !exp.isBold;
                  handleUpdateExperience(exp.id, 'isBold', newValue);
                  // Show visual feedback
                  if (newValue) {
                    Alert.alert('Bold Text', 'Description text will be displayed in bold');
                  }
                }}
              >
                <Text style={[
                  styles.boldToggleText,
                  exp.isBold && styles.boldToggleActiveText
                ]}>
                  B
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveExperience}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        // Display mode (collapsed)
        <>
          <View style={styles.experienceHeader}>
            <View style={styles.companyLogoPlaceholder}>
              <Text style={styles.companyInitial}>🧠</Text>
            </View>
            <View style={styles.experienceInfo}>
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
              
              <View style={styles.durationLocationContainer}>
                <Text style={[
                  styles.durationText,
                  { color: darkMode ? colors.textSecondary : COLORS.gray }
                ]}>
                  {formatDuration(exp.startDate, exp.endDate) || 'Duration'}
                </Text>
                
                {exp.location && (
                  <View style={styles.locationRow}>
                    <Text style={styles.locationIconText}>📍</Text>
                    <Text style={[
                      styles.locationText,
                      { color: darkMode ? colors.textSecondary : COLORS.gray }
                    ]}>
                      {exp.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.editExperienceButton}
              onPress={toggleEdit}
            >
              <Text style={styles.editIconText}>✏️</Text>
            </TouchableOpacity>
          </View>
          
          {exp.description && (
            <Text style={[
              styles.descriptionText,
              { color: darkMode ? colors.text : COLORS.primary },
              exp.isBold ? styles.boldText : null
            ]}>
              {exp.description}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const ExperienceSection = ({ 
  profileData, 
  isEditing, 
  handleAddExperience,
  handleRemoveExperience,
  handleUpdateExperience,
  darkMode,
  colors
}) => {
  // Direct add experience function
  const onAddExperience = () => {
    handleAddExperience();
  };

  // Ensure experience array exists
  const experiences = profileData.experience || [];
  
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
          Experience ({experiences.length})
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddExperience}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>Add Experience</Text>
        </TouchableOpacity>
      </View>
      
      {experiences.length > 0 ? (
        experiences.map((exp) => (
          <ExperienceItem
            key={exp.id}
            exp={exp}
            isEditing={isEditing}
            handleRemoveExperience={handleRemoveExperience}
            handleUpdateExperience={handleUpdateExperience}
            darkMode={darkMode}
            colors={colors}
          />
        ))
      ) : (
        <View style={styles.emptyExperienceContainer}>
          <View style={styles.briefcaseIconFallback}>
            <Text style={styles.briefcaseIconText}>🧠</Text>
          </View>
          <Text style={[
            styles.emptyText,
            { color: darkMode ? colors.textSecondary : COLORS.gray }
          ]}>
            Add your work experience to showcase your professional journey
          </Text>
          <TouchableOpacity 
            style={styles.emptyAddButton}
            onPress={onAddExperience}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyAddButtonText}>Add Experience</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditing && experiences.length > 0 && (
        <View style={styles.requiredFieldsNote}>
          <Text style={[
            styles.requiredFieldsText,
            { color: darkMode ? colors.textSecondary : COLORS.gray }
          ]}>
            <Text style={styles.requiredStar}>*</Text> Required fields
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper function to format duration
const formatDuration = (startDate, endDate) => {
  if (!startDate) return '';
  
  return `${startDate || ''} - ${endDate || 'Present'}`;
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
  addButton: {
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
  },
  addButtonText: {
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
  experienceHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  companyLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.tertiary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  companyInitial: {
    fontSize: 24,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceEditFields: {
    flex: 1,
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
  durationLocationContainer: {
    marginTop: 4,
  },
  durationText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationIconText: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  experienceInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    paddingBottom: 5,
    marginBottom: SIZES.small / 2,
  },
  experienceDetails: {
    marginLeft: 50,
    paddingLeft: SIZES.small,
  },
  dateLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  dateContainer: {
    width: '48%',
  },
  fieldLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  dateInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  locationContainer: {
    marginBottom: SIZES.small,
  },
  locationInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  experienceDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    textAlignVertical: 'top',
    height: 100,
  },
  experienceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  removeExperienceButton: {
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
  },
  removeButtonText: {
    color: COLORS.tertiary,
    fontSize: SIZES.small,
    fontFamily: FONT.medium,
  },
  saveButton: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    marginLeft: SIZES.small,
  },
  saveButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  descriptionText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    marginTop: SIZES.small,
    marginLeft: 50,
    paddingLeft: SIZES.small,
  },
  boldText: {
    fontFamily: FONT.bold,
    fontWeight: 'bold',
  },
  editExperienceButton: {
    padding: SIZES.small / 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.tertiary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 16,
  },
  emptyExperienceContainer: {
    alignItems: 'center',
    padding: SIZES.medium,
  },
  briefcaseIconFallback: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  briefcaseIconText: {
    fontSize: 40,
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SIZES.small,
  },
  emptyAddButton: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    marginTop: SIZES.small,
  },
  emptyAddButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  requiredStar: {
    color: COLORS.tertiary,
    fontWeight: 'bold',
  },
  requiredFieldContainer: {
    marginBottom: SIZES.small / 2,
  },
  requiredFieldsNote: {
    marginTop: SIZES.small,
    alignItems: 'flex-end',
  },
  requiredFieldsText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    fontStyle: 'italic',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldToggle: {
    backgroundColor: COLORS.tertiary + '20',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  boldToggleActive: {
    backgroundColor: COLORS.tertiary,
  },
  boldToggleText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
  },
  boldToggleActiveText: {
    color: COLORS.white,
  },
  descriptionNote: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small - 2,
    fontStyle: 'italic',
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: SIZES.small,
  },
});

export default ExperienceSection; 