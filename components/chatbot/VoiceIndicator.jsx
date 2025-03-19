"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { COLORS } from "../../constants"

const VoiceIndicator = ({ isRecording }) => {
  const animation1 = useRef(new Animated.Value(1)).current
  const animation2 = useRef(new Animated.Value(1)).current
  const animation3 = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let animation1Loop, animation2Loop, animation3Loop

    if (isRecording) {
      // Start the animation sequence
      animation1Loop = Animated.loop(
        Animated.sequence([
          Animated.timing(animation1, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animation1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      )
      animation1Loop.start()

      // Start the second animation with a delay
      setTimeout(() => {
        animation2Loop = Animated.loop(
          Animated.sequence([
            Animated.timing(animation2, {
              toValue: 1.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(animation2, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        )
        animation2Loop.start()
      }, 150)

      // Start the third animation with a delay
      setTimeout(() => {
        animation3Loop = Animated.loop(
          Animated.sequence([
            Animated.timing(animation3, {
              toValue: 1.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(animation3, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        )
        animation3Loop.start()
      }, 500)
    }

    return () => {
      // Clean up animations
      if (animation1Loop) animation1Loop.stop()
      if (animation2Loop) animation2Loop.stop()
      if (animation3Loop) animation3Loop.stop()

      // Reset to initial values
      animation1.setValue(1)
      animation2.setValue(1)
      animation3.setValue(1)
    }
  }, [isRecording, animation1, animation2, animation3])

  if (!isRecording) return null

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation1 }] }]} />
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation2 }] }]} />
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation3 }] }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    width: 30,
  },
  bar: {
    width: 3,
    height: 15,
    backgroundColor: COLORS.tertiary,
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
})

export default VoiceIndicator

