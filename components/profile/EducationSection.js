import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT, SIZES, icons } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const EducationSection = ({ profileData, setProfileData, isEditing }) => {
  const { darkMode, colors } = useTheme();
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddEducation = () => {
    if (newEducation.school && newEducation.degree) {
      const updatedEducation = [...(profileData.education || []), { ...newEducation, id: Date.now().toString() }];
      setProfileData({ ...profileData, education: updatedEducation });
      setNewEducation({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveEducation = (id) => {
    const updatedEducation = profileData.education.filter(item => item.id !== id);
    setProfileData({ ...profileData, education: updatedEducation });
  };

  return (
    <View style={[styles.section, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: darkMode ? colors.text : COLORS.primary }]}>
        Education
      </Text>

      {/* Display existing education entries */}
      {profileData.education && profileData.education.length > 0 ? (
        profileData.education.map((edu, index) => (
          <View key={edu.id || index} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <Text style={[styles.schoolName, { color: darkMode ? colors.text : COLORS.primary }]}>
                {edu.school}
              </Text>
              {isEditing && (
                <TouchableOpacity onPress={() => handleRemoveEducation(edu.id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.tertiary} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.degree, { color: darkMode ? colors.textSecondary : COLORS.secondary }]}>
              {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
            </Text>
            {(edu.startDate || edu.endDate) && (
              <Text style={[styles.dates, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                {edu.startDate || 'N/A'} - {edu.endDate || 'Present'}
              </Text>
            )}
            {edu.description && (
              <Text style={[styles.description, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                {edu.description}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
          No education information added yet.
        </Text>
      )}

      {/* Add education form */}
      {isEditing && (
        <>
          {showAddForm ? (
            <View style={styles.addForm}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: darkMode ? colors.text : COLORS.primary,
                    borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                  }
                ]}
                value={newEducation.school}
                onChangeText={(text) => setNewEducation({ ...newEducation, school: text })}
                placeholder="School/University"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              />
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: darkMode ? colors.text : COLORS.primary,
                    borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                  }
                ]}
                value={newEducation.degree}
                onChangeText={(text) => setNewEducation({ ...newEducation, degree: text })}
                placeholder="Degree"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              />
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: darkMode ? colors.text : COLORS.primary,
                    borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                  }
                ]}
                value={newEducation.fieldOfStudy}
                onChangeText={(text) => setNewEducation({ ...newEducation, fieldOfStudy: text })}
                placeholder="Field of Study"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              />
              <View style={styles.dateContainer}>
                <TextInput
                  style={[
                    styles.dateInput,
                    { 
                      color: darkMode ? colors.text : COLORS.primary,
                      borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                    }
                  ]}
                  value={newEducation.startDate}
                  onChangeText={(text) => setNewEducation({ ...newEducation, startDate: text })}
                  placeholder="Start Date"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
                <TextInput
                  style={[
                    styles.dateInput,
                    { 
                      color: darkMode ? colors.text : COLORS.primary,
                      borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                    }
                  ]}
                  value={newEducation.endDate}
                  onChangeText={(text) => setNewEducation({ ...newEducation, endDate: text })}
                  placeholder="End Date"
                  placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                />
              </View>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { 
                    color: darkMode ? colors.text : COLORS.primary,
                    borderColor: darkMode ? colors.textSecondary : COLORS.gray2
                  }
                ]}
                value={newEducation.description}
                onChangeText={(text) => setNewEducation({ ...newEducation, description: text })}
                placeholder="Description"
                placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
                multiline
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.addButton]} 
                  onPress={handleAddEducation}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: COLORS.tertiary }]} 
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.addButtonText}>Add Education</Text>
            </TouchableOpacity>
          )}
        </>
      )}
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
  educationItem: {
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  schoolName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  degree: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 2,
    marginTop: 2,
  },
  dates: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    marginTop: 2,
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    fontStyle: 'italic',
  },
  addForm: {
    marginTop: SIZES.medium,
  },
  input: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderRadius: SIZES.small / 2,
    padding: SIZES.small,
    marginBottom: SIZES.small,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderRadius: SIZES.small / 2,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    width: '48%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: SIZES.small,
    borderRadius: SIZES.small / 2,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
  },
  addButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.small / 2,
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  buttonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  addButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default EducationSection; 