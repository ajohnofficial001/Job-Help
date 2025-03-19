"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native"
import { COLORS, FONT, SIZES, SHADOWS, icons } from "../../constants"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import ChatMessage from "./ChatMessage"
import VoiceIndicator from "./VoiceIndicator"
import { generateChatResponse } from "../../services/chatbotService"
import * as Permissions from "expo-permissions"
// Replace the import for Voice with a platform-specific import
// Only import Voice on native platforms
const Voice = Platform.OS !== "web" ? require("@react-native-voice/voice").default : null

// Now let's modify the ChatbotOverlay component to include voice recognition
const ChatbotOverlay = ({ isVisible, onClose }) => {
  const { darkMode, colors } = useTheme()
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi there! I'm your NextUp assistant. I can help you find jobs matching your skills or improve your resume. What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [speechResults, setSpeechResults] = useState([])
  const slideAnim = useRef(new Animated.Value(isVisible ? 0 : 500)).current
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current
  const flatListRef = useRef(null)

  // Suggested questions for quick access
  const suggestedQuestions = [
    "Find jobs for my skills",
    "Help improve my resume",
    "Job interview tips",
    "Salary negotiation advice",
  ]

  // Replace the useEffect for voice setup with this platform-aware version
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }

    // Set up voice recognition only on native platforms
    if (Platform.OS !== "web" && Voice) {
      try {
        Voice.onSpeechStart = onSpeechStart
        Voice.onSpeechEnd = onSpeechEnd
        Voice.onSpeechResults = onSpeechResults
        Voice.onSpeechError = onSpeechError
      } catch (e) {
        console.error("Failed to set up Voice event handlers:", e)
      }

      return () => {
        // Clean up voice recognition only on native platforms
        try {
          Voice.destroy().then(() => {
            try {
              Voice.removeAllListeners()
            } catch (e) {
              console.error("Failed to remove Voice listeners:", e)
            }
          })
        } catch (e) {
          console.error("Failed to destroy Voice:", e)
        }
      }
    }
  }, [isVisible, slideAnim, fadeAnim])

  // Voice recognition handlers
  const onSpeechStart = () => {
    console.log("Speech recognition started")
  }

  const onSpeechEnd = () => {
    setIsRecording(false)
    console.log("Speech recognition ended")
  }

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      setSpeechResults(e.value)
      setInputText(e.value[0]) // Set the first (most likely) result as input text
    }
    console.log("Speech results:", e)
  }

  const onSpeechError = (e) => {
    console.error("Speech recognition error:", e)
    setIsRecording(false)
  }

  // Replace the startRecording function with this platform-aware version
  const startRecording = async () => {
    try {
      if (Platform.OS === "web") {
        // Use Web Speech API for web
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
          console.error("Speech recognition not supported in this browser")
          return
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = "en-US"
        recognition.interimResults = false

        recognition.onstart = () => {
          setIsRecording(true)
          console.log("Web speech recognition started")
        }

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputText(transcript)
          console.log("Web speech result:", transcript)
        }

        recognition.onerror = (event) => {
          console.error("Web speech recognition error:", event.error)
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
          console.log("Web speech recognition ended")
        }

        recognition.start()
        window.currentRecognition = recognition // Store reference for cleanup
      } else if (Voice) {
        // Use React Native Voice for native platforms
        if (Platform.OS === "android") {
          try {
            const granted = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
            if (granted.status !== "granted") {
              console.error("Permission to record audio was denied")
              return
            }
          } catch (error) {
            console.error("Error requesting audio permission:", error)
            return
          }
        }

        try {
          await Voice.start("en-US")
          setIsRecording(true)
          setSpeechResults([])
        } catch (error) {
          console.error("Error starting voice recognition:", error)
          setIsRecording(false)
        }
      } else {
        console.error("Voice recognition not available on this platform")
      }
    } catch (error) {
      console.error("Unexpected error in startRecording:", error)
      setIsRecording(false)
    }
  }

  // Replace the stopRecording function with this platform-aware version
  const stopRecording = async () => {
    try {
      if (Platform.OS === "web") {
        // Stop Web Speech API for web
        if (window.currentRecognition) {
          window.currentRecognition.stop()
          delete window.currentRecognition
        }
      } else if (Voice) {
        // Use React Native Voice for native platforms
        await Voice.stop()
      }
      setIsRecording(false)
    } catch (error) {
      console.error("Error stopping voice recognition:", error)
      setIsRecording(false)
    }
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      // Get conversation history (excluding the welcome message)
      const conversationHistory = messages.slice(1)

      // Get AI response
      const response = await generateChatResponse(inputText, user?.skills || [], conversationHistory)

      // Handle normal response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        isJson: response.isJson,
        jsonData: response.isJson ? response.data : null,
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error getting chatbot response:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInputText(question)
    // Optional: automatically send the suggested question
    // setTimeout(() => handleSendMessage(), 100);
  }

  // Add this cleanup function to the component
  useEffect(() => {
    return () => {
      // Clean up web speech recognition if active
      if (Platform.OS === "web" && window.currentRecognition) {
        try {
          window.currentRecognition.stop()
          delete window.currentRecognition
        } catch (e) {
          console.error("Error cleaning up web speech recognition:", e)
        }
      }
    }
  }, [])

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          backgroundColor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
          opacity: fadeAnim,
        },
        !isVisible && { display: "none" },
      ]}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <Animated.View
          style={[
            styles.chatContainer,
            {
              backgroundColor: darkMode ? colors.background : COLORS.lightWhite,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Chat Header */}
          <View style={[styles.chatHeader, { backgroundColor: COLORS.tertiary }]}>
            <View style={styles.chatHeaderContent}>
              <View style={styles.chatHeaderLeft}>
                <Image source={icons.menu} style={[styles.chatIcon, { tintColor: COLORS.white }]} />
                <Text style={styles.chatTitle}>JobHelp Assistant</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage message={item} darkMode={darkMode} colors={colors} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <View style={styles.suggestedQuestionsContainer}>
              <Text style={[styles.suggestedQuestionsTitle, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
                Try asking:
              </Text>
              <View style={styles.suggestedQuestionsList}>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestedQuestionButton,
                      { backgroundColor: darkMode ? colors.surface : COLORS.white },
                    ]}
                    onPress={() => handleSuggestedQuestion(question)}
                  >
                    <Text style={[styles.suggestedQuestionText, { color: COLORS.tertiary }]}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Input Area */}
          <View style={[styles.inputContainer, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
            <TextInput
              style={[
                styles.input,
                { color: darkMode ? colors.text : COLORS.primary },
                isRecording && styles.recordingInput,
              ]}
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              placeholderTextColor={darkMode ? colors.textSecondary : COLORS.gray}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            {/* Voice Input Button */}
            <TouchableOpacity
              style={[styles.voiceButton, isRecording && styles.recordingButton]}
              onPress={handleVoiceInput}
            >
              {isRecording ? (
                <VoiceIndicator isRecording={isRecording} />
              ) : (
                <Image source={icons.microphone} style={[styles.voiceIcon, { backgroundColor: COLORS.white }]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sendButton, { opacity: inputText.trim() === "" ? 0.5 : 1 }]}
              onPress={handleSendMessage}
              disabled={inputText.trim() === "" || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Image
                  source={icons.search} // Using search icon as send
                  style={[styles.sendIcon, { tintColor: COLORS.white }]}
                />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  )
}

// Update the styles to include new voice input related styles
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chatContainer: {
    height: "80%",
    borderTopLeftRadius: SIZES.large,
    borderTopRightRadius: SIZES.large,
    overflow: "hidden",
    ...SHADOWS.large,
  },
  chatHeader: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  chatHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatIcon: {
    width: 24,
    height: 24,
    marginRight: SIZES.small,
  },
  chatTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: SIZES.large,
    color: COLORS.white,
    lineHeight: 30,
    textAlign: "center",
  },
  messagesContainer: {
    padding: SIZES.medium,
    paddingBottom: SIZES.xLarge,
  },
  suggestedQuestionsContainer: {
    padding: SIZES.medium,
    paddingTop: 0,
  },
  suggestedQuestionsTitle: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginBottom: SIZES.small,
  },
  suggestedQuestionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SIZES.small,
  },
  suggestedQuestionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    marginBottom: SIZES.small,
  },
  suggestedQuestionText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
  },
  inputContainer: {
    flexDirection: "row",
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    maxHeight: 100,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    marginRight: SIZES.small,
  },
  recordingInput: {
    borderColor: COLORS.tertiary,
    borderWidth: 2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.small,
  },
  recordingButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.tertiary,
  },
  voiceIcon: {
    width: 45,
    height: 45,
  },
})

export default ChatbotOverlay

