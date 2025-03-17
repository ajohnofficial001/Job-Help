import { View, Text, StyleSheet, ScrollView } from "react-native"
import { COLORS, FONT, SIZES } from "../../constants"

const JsonResponseRenderer = ({ jsonData, darkMode, colors }) => {
  // Function to render different types of content
  const renderContent = (data) => {
    if (!data) return null

    // If it's a simple string, just return it
    if (typeof data === "string") {
      return <Text style={[styles.text, { color: darkMode ? colors.text : COLORS.primary }]}>{data}</Text>
    }

    // If it's an array, render each item
    if (Array.isArray(data)) {
      return (
        <View style={styles.listContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bulletPoint, { color: darkMode ? colors.text : COLORS.primary }]}>•</Text>
              <Text style={[styles.text, { color: darkMode ? colors.text : COLORS.primary, flex: 1 }]}>
                {typeof item === "object" ? JSON.stringify(item) : item}
              </Text>
            </View>
          ))}
        </View>
      )
    }

    // If it's an object, render its properties
    if (typeof data === "object") {
      return Object.entries(data).map(([key, value], index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: darkMode ? colors.text : COLORS.primary }]}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
          {renderContent(value)}
        </View>
      ))
    }

    // Default case
    return <Text style={[styles.text, { color: darkMode ? colors.text : COLORS.primary }]}>{String(data)}</Text>
  }

  return <ScrollView style={styles.container}>{renderContent(jsonData)}</ScrollView>
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
  },
  section: {
    marginBottom: SIZES.small,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    marginBottom: SIZES.small / 2,
  },
  text: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium - 2,
    lineHeight: 20,
  },
  listContainer: {
    marginTop: SIZES.small / 2,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: SIZES.small / 2,
    paddingRight: SIZES.small,
  },
  bulletPoint: {
    marginRight: SIZES.small / 2,
    fontSize: SIZES.medium,
  },
})

export default JsonResponseRenderer

