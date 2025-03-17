import { View, Text, StyleSheet } from "react-native"
import { COLORS, FONT, SIZES } from "../../constants"

const StatusBadge = ({ status }) => {
  // Get color based on status
  const getColor = () => {
    switch (status) {
      case "Saved":
        return "#6C63FF" // Purple
      case "Applied":
        return "#4CAF50" // Green
      case "Interviewing":
        return "#2196F3" // Blue
      case "Offer":
        return "#FF9800" // Orange
      case "Rejected":
        return "#F44336" // Red
      case "Completed":
        return "#9E9E9E" // Gray
      default:
        return COLORS.gray
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: getColor() + "20", borderColor: getColor() }]}>
      <Text style={[styles.text, { color: getColor() }]}>{status}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 4,
    borderRadius: SIZES.small,
    borderWidth: 1,
  },
  text: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small - 2,
  },
})

export default StatusBadge

