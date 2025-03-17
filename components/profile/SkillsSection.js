import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const SkillsSection = ({ 
  profileData, 
  isEditing, 
  handleAddSkill,
  handleRemoveSkill,
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
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SIZES.small,
  },
});

export default SkillsSection; 