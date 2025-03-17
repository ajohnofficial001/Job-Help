import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const SkillsModal = ({ 
  showSkillsModal,
  setShowSkillsModal,
  availableSkills,
  selectedSkills,
  handleSkillSelection,
  handleSaveSkills,
  darkMode,
  colors
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default SkillsModal; 