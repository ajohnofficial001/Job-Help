"use client"

import { View, ScrollView, SafeAreaView, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native"
import { useState, useEffect } from "react"
import { Stack, useRouter } from "expo-router"

import { COLORS, icons, SIZES, SHADOWS, images } from "../constants"
import { Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome } from "../components"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import ChatbotButton from "../components/chatbot/ChatbotButton"
import ChatbotOverlay from "../components/chatbot/ChatbotOverlay"

const Home = () => {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { darkMode, colors } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [isChatbotVisible, setIsChatbotVisible] = useState(false)

  useEffect(() => {
    // Show sign-in prompt after 10 seconds if user is not authenticated
    const timer = setTimeout(() => {
      if (!user && !isLoading) {
        setShowSignInPrompt(true)
        Alert.alert("Welcome to Job Help!", "Would you like to sign in or create an account to access all features?", [
          {
            text: "Maybe Later",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/auth/signin"),
          },
          {
            text: "Create Account",
            onPress: () => router.push("/auth/signup"),
          },
        ])
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [user, isLoading])

  const toggleChatbot = () => {
    console.log("Toggling chatbot, current state:", isChatbotVisible)
    setIsChatbotVisible(!isChatbotVisible)
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: darkMode ? colors.background : COLORS.lightWhite,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.tertiary} />
      </SafeAreaView>
    )
  }

  // Determine the profile image source
  const profileImageSource = user?.profilePicture
    ? { uri: user.profilePicture }
    : { uri: "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg" }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: darkMode ? colors.background : COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <Image source={icons.logo} style={{ width: "8rem", resizeMode: "contain" }} />,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  marginRight: SIZES.medium,
                  padding: SIZES.small / 2,
                  backgroundColor: COLORS.tertiary,
                  borderRadius: SIZES.small,
                }}
                onPress={() => router.push("/bookmarks")}
              >
                <Image
                  source={icons.heart}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: COLORS.tertiary,
                  backgroundColor: COLORS.white,
                  overflow: "hidden",
                  ...SHADOWS.small,
                }}
                onPress={() => (user ? router.push("/profile") : router.push("/auth/signin"))}
              >
                <Image
                  source={profileImageSource}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: "",
        }}
      />
      <ScrollView style={{ backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/search/${searchTerm}`)
              }
            }}
          />
          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>

      {/* Chatbot Button */}
      <ChatbotButton onPress={toggleChatbot} isActive={isChatbotVisible} />

      {/* Chatbot Overlay */}
      <ChatbotOverlay isVisible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
    </SafeAreaView>
  )
}

export default Home

