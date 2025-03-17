import React from 'react';
import { 
  View, 
  Text, 
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const SettingsSection = ({ 
  notificationsEnabled, 
  setNotificationsEnabled,
  darkMode,
  toggleDarkMode,
  handleSignOut,
  isLoading,
  colors
}) => {
  return (
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
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
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
});

export default SettingsSection; 