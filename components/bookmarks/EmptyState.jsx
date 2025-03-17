import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants"

const EmptyState = ({ message, buttonText, onPress, darkMode, colors }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/empty-state.png")} style={styles.image} resizeMode="contain" />

      <Text style={[styles.message, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>{message}</Text>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.large,
    marginTop: SIZES.xLarge,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: SIZES.medium,
    opacity: 0.7,
  },
  message: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    textAlign: "center",
    marginBottom: SIZES.medium,
  },
  button: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.medium,
    ...SHADOWS.small,
  },
  buttonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
})

export default EmptyState

