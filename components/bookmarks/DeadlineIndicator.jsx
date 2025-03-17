import { View, Text, StyleSheet } from "react-native"
import { FONT, SIZES } from "../../constants"

const DeadlineIndicator = ({ daysRemaining }) => {
  // If no deadline or invalid value, don't show indicator
  if (daysRemaining === null || daysRemaining === undefined) {
    return null
  }

  // Determine color based on days remaining
  const getColor = () => {
    if (daysRemaining < 0) return "#888888" // Past deadline (gray)
    if (daysRemaining <= 2) return "#FF5C5C" // Urgent (red)
    if (daysRemaining <= 7) return "#FFA500" // Soon (orange)
    return "#4CAF50" // Plenty of time (green)
  }

  // Get text to display
  const getText = () => {
    if (daysRemaining < 0) return `${Math.abs(daysRemaining)}d overdue`
    if (daysRemaining === 0) return "Today"
    if (daysRemaining === 1) return "Tomorrow"
    return `${daysRemaining}d left`
  }

  return (
    <View style={[styles.container, { backgroundColor: getColor() + "20", borderColor: getColor() }]}>
      <Text style={[styles.text, { color: getColor() }]}>{getText()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 4,
    borderRadius: SIZES.small,
    borderWidth: 1,
    marginLeft: SIZES.small,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small - 2,
  },
})

export default DeadlineIndicator

