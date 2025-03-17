"use client"

import { View, Text, TouchableOpacity, Image, Linking, Alert, Platform, TextInput, Modal } from "react-native"
import { useState, useEffect } from "react"
import styles from "./footer.style"
import { icons } from "../../../constants"
import { useBookmarks } from "../../../context/BookmarkContext"
import { COLORS, FONT, SIZES } from "../../../constants"

// Only import DateTimePickerModal on native platforms
let DateTimePickerModal = null
if (Platform.OS !== "web") {
  // Dynamic import for native platforms
  try {
    DateTimePickerModal = require("react-native-modal-datetime-picker").default
  } catch (error) {
    console.log("DateTimePickerModal not available", error)
  }
}

const Footer = ({ url, job }) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [notes, setNotes] = useState("")
  const [webDate, setWebDate] = useState("")
  const [showWebModal, setShowWebModal] = useState(false)
  const [jobData, setJobData] = useState(null)

  // Effect to ensure we have job data
  useEffect(() => {
    console.log("Footer component received job data:", job)
    if (job) {
      setJobData(job)
    }
  }, [job])

  const isJobBookmarked = jobData ? isBookmarked(jobData.job_id) : false

  const handleBookmarkToggle = () => {
    if (!jobData) {
      console.error("No job data available for bookmarking")
      if (Platform.OS === "web") {
        window.alert("Cannot bookmark: Job data is not available")
      } else {
        Alert.alert("Error", "Cannot bookmark: Job data is not available")
      }
      return
    }

    if (isJobBookmarked) {
      // Remove bookmark
      handleRemoveBookmark()
    } else {
      // Add bookmark - show date picker based on platform
      if (Platform.OS === "web") {
        setShowWebModal(true)
      } else {
        setDatePickerVisible(true)
      }
    }
  }

  const handleRemoveBookmark = async () => {
    if (!jobData) return

    try {
      const result = await removeBookmark(jobData.job_id)
      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to remove bookmark")
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred")
    }
  }

  const handleConfirmDate = async (date) => {
    setDatePickerVisible(false)

    if (!jobData) return

    try {
      const result = await addBookmark(jobData, date.toISOString(), notes)

      if (result.success) {
        Alert.alert("Success", "Job bookmarked successfully!")
      } else {
        Alert.alert("Error", result.error || "Failed to bookmark job")
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred")
    }
  }

  const handleCancelDate = () => {
    setDatePickerVisible(false)

    // Allow bookmarking without a deadline
    if (jobData) {
      addBookmark(jobData, null, notes)
    }
  }

  // Web-specific function to handle date submission
  const handleWebDateSubmit = async () => {
    console.log("Web date submit triggered", { webDate, notes, jobData })
    setShowWebModal(false)

    if (!jobData) {
      console.error("No job data available")
      window.alert("Error: No job data available")
      return
    }

    try {
      // Convert the string date to ISO string if provided
      const dateToUse = webDate ? new Date(webDate).toISOString() : null
      console.log("Adding bookmark with date:", dateToUse)

      const result = await addBookmark(jobData, dateToUse, notes)
      console.log("Bookmark result:", result)

      if (result.success) {
        // Use window.alert for web to ensure it's visible
        if (Platform.OS === "web") {
          window.alert("Job bookmarked successfully!")
        } else {
          Alert.alert("Success", "Job bookmarked successfully!")
        }
      } else {
        if (Platform.OS === "web") {
          window.alert(result.error || "Failed to bookmark job")
        } else {
          Alert.alert("Error", result.error || "Failed to bookmark job")
        }
      }

      // Reset form
      setWebDate("")
      setNotes("")
    } catch (error) {
      console.error("Error in handleWebDateSubmit:", error)
      if (Platform.OS === "web") {
        window.alert(error.message || "An unexpected error occurred")
      } else {
        Alert.alert("Error", error.message || "An unexpected error occurred")
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn} onPress={handleBookmarkToggle}>
        <Image
          source={isJobBookmarked ? icons.heart : icons.heartOutline}
          resizeMode="contain"
          style={[styles.likeBtnImage, isJobBookmarked && { tintColor: "#F44336" }]}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.applyBtn} onPress={() => Linking.openURL(url)}>
        <Text style={styles.applyBtnText}>Apply Now</Text>
      </TouchableOpacity>

      {/* Native Date Picker - only render on native platforms */}
      {Platform.OS !== "web" && DateTimePickerModal && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={handleCancelDate}
          minimumDate={new Date()}
        />
      )}

      {/* Web Modal for date input */}
      {Platform.OS === "web" && (
        <Modal
          visible={showWebModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowWebModal(false)}
        >
          <View style={webStyles.modalOverlay}>
            <View style={webStyles.modalContent}>
              <Text style={webStyles.modalTitle}>Bookmark Job</Text>

              <Text style={webStyles.label}>Application Deadline (Optional)</Text>
              <TextInput
                style={webStyles.input}
                placeholder="YYYY-MM-DD"
                value={webDate}
                onChangeText={setWebDate}
                // On web, use the native date input
                {...(Platform.OS === "web" ? { type: "date" } : {})}
              />

              <Text style={webStyles.label}>Notes (Optional)</Text>
              <TextInput
                style={[webStyles.input, webStyles.textArea]}
                placeholder="Add notes about this job..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              <View style={webStyles.buttonContainer}>
                <TouchableOpacity
                  style={[webStyles.button, webStyles.cancelButton]}
                  onPress={() => setShowWebModal(false)}
                >
                  <Text style={webStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[webStyles.button, webStyles.saveButton]} onPress={handleWebDateSubmit}>
                  <Text style={webStyles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

// Additional styles for the web modal
const webStyles = {
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: "center",
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: SIZES.small / 2,
  },
  input: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    marginHorizontal: SIZES.small / 2,
  },
  cancelButton: {
    backgroundColor: COLORS.gray2,
  },
  saveButton: {
    backgroundColor: COLORS.tertiary,
  },
  buttonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
}

export default Footer

