"use client"

import { Stack } from "expo-router"
import { useCallback } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { ThemeProvider } from "../context/ThemeContext"
import { AuthProvider } from "../context/AuthContext"
import { BookmarkProvider } from "../context/BookmarkContext"
import { Platform } from "react-native"

// Polyfill AsyncStorage for web
if (Platform.OS === "web") {
  // Simple localStorage-based implementation for web
  global.AsyncStorage = {
    getItem: async (key) => {
      try {
        const value = localStorage.getItem(key)
        return value
      } catch (error) {
        console.error("AsyncStorage getItem error:", error)
        return null
      }
    },
    setItem: async (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.error("AsyncStorage setItem error:", error)
      }
    },
    removeItem: async (key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error("AsyncStorage removeItem error:", error)
      }
    },
  }
}

SplashScreen.preventAutoHideAsync()

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <AuthProvider>
      <ThemeProvider>
        <BookmarkProvider>
          <Stack onLayout={onLayoutRootView} />
        </BookmarkProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default Layout

