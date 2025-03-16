"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { COLORS, FONT, SIZES, SHADOWS } from "../../constants"
import { setApiKey, hasValidApiKey } from "../../services/openaiService"

const ApiKeyModal = ({ isVisible, onClose, onSuccess }) => {
  const [apiKey, setApiKeyValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false)

  useEffect(() => {
    // Check if we already have an API key from .env
    const checkApiKey = async () => {
      const hasKey = await hasValidApiKey()
      setHasEnvApiKey(hasKey)

      // If we have a key and the modal is visible, we can auto-close it
      if (hasKey && isVisible) {
        onSuccess()
      }
    }

    checkApiKey()
  }, [isVisible])

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await setApiKey(apiKey.trim())

      if (result.success) {
        setApiKeyValue("")
        onSuccess()
        Alert.alert("Success", "API key saved successfully!")
      } else {
        setError(result.error || "Failed to save API key")
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // If we have an API key from .env, show a different message
  if (hasEnvApiKey) {
    return (
      <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>API Key Found</Text>

            <Text style={styles.modalDescription}>
              An OpenAI API key has been detected in your environment. You can use the chatbot without entering a key.
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, { marginTop: SIZES.medium }]}
              onPress={onSuccess}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter OpenAI API Key</Text>

          <Text style={styles.modalDescription}>
            To use the AI-powered assistant, you need to provide your OpenAI API key. You can get one from the OpenAI
            website.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="sk-..."
            placeholderTextColor={COLORS.gray}
            value={apiKey}
            onChangeText={setApiKeyValue}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isLoading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.helpLink}
            onPress={() =>
              Alert.alert(
                "How to Get an API Key",
                "1. Go to platform.openai.com\n2. Sign up or log in\n3. Navigate to API keys section\n4. Create a new secret key\n5. Copy and paste it here",
              )
            }
          >
            <Text style={styles.helpLinkText}>How to get an API key?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  modalDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
  },
  input: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    marginBottom: SIZES.small,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.small,
  },
  button: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.gray2,
    marginRight: SIZES.small / 2,
  },
  saveButton: {
    backgroundColor: COLORS.tertiary,
    marginLeft: SIZES.small / 2,
  },
  buttonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  helpLink: {
    marginTop: SIZES.medium,
    alignItems: "center",
  },
  helpLinkText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.tertiary,
    textDecorationLine: "underline",
  },
})

export default ApiKeyModal

