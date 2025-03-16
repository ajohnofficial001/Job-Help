"use client"

import React from "react"
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native"
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants"

const ChatbotButton = ({ onPress, isActive }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    if (!isActive) {
      pulse.start()
    } else {
      pulse.stop()
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => pulse.stop()
  }, [isActive, pulseAnim])

  return (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity style={[styles.button, isActive && styles.activeButton]} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{isActive ? "×" : "💬"}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.tertiary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  activeButton: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    fontSize: SIZES.xLarge,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
})

export default ChatbotButton

