"use client"

import { View, Text, TouchableOpacity, Image, Linking, Modal, Platform, TextInput, StyleSheet } from "react-native"
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
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

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
      setErrorMessage("Cannot bookmark: Job data is not available")
      setShowErrorModal(true)
      return
    }

    if (isJobBookmarked) {
      // Remove bookmark - show confirmation modal
      setShowRemoveModal(true)
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
        setErrorMessage(result.error || "Failed to remove bookmark")
        setShowErrorModal(true)
      } else {
        setSuccessMessage("Job removed from bookmarks")
        setShowSuccessModal(true)
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
    } finally {
      setShowRemoveModal(false)
    }
  }

  const handleConfirmDate = async (date) => {
    setDatePickerVisible(false)

    if (!jobData) return

    try {
      const result = await addBookmark(jobData, date.toISOString(), notes)

      if (result.success) {
        setSuccessMessage("Job bookmarked successfully!")
        setShowSuccessModal(true)
      } else {
        setErrorMessage(result.error || "Failed to bookmark job")
        setShowErrorModal(true)
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
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
      setErrorMessage("Error: No job data available")
      setShowErrorModal(true)
      return
    }

    try {
      // Convert the string date to ISO string if provided
      const dateToUse = webDate ? new Date(webDate).toISOString() : null
      console.log("Adding bookmark with date:", dateToUse)

      const result = await addBookmark(jobData, dateToUse, notes)
      console.log("Bookmark result:", result)

      if (result.success) {
        setSuccessMessage("Job bookmarked successfully!")
        setShowSuccessModal(true)
      } else {
        setErrorMessage(result.error || "Failed to bookmark job")
        setShowErrorModal(true)
      }

      // Reset form
      setWebDate("")
      setNotes("")
    } catch (error) {
      console.error("Error in handleWebDateSubmit:", error)
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
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
      <Modal
        visible={showWebModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWebModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Bookmark Job</Text>

            <Text style={modalStyles.label}>Application Deadline (Optional)</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="YYYY-MM-DD"
              value={webDate}
              onChangeText={setWebDate}
              // On web, use the native date input
              {...(Platform.OS === "web" ? { type: "date" } : {})}
            />

            <Text style={modalStyles.label}>Notes (Optional)</Text>
            <TextInput
              style={[modalStyles.input, modalStyles.textArea]}
              placeholder="Add notes about this job..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowWebModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.button, modalStyles.saveButton]} onPress={handleWebDateSubmit}>
                <Text style={modalStyles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Remove Bookmark Confirmation Modal */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Remove Bookmark</Text>
            <Text style={modalStyles.modalText}>Are you sure you want to remove this job from your bookmarks?</Text>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowRemoveModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.button, modalStyles.deleteButton]} onPress={handleRemoveBookmark}>
                <Text style={modalStyles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Success</Text>
            <Text style={modalStyles.modalText}>{successMessage}</Text>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.saveButton, { marginTop: 20 }]}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={modalStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Error</Text>
            <Text style={modalStyles.modalText}>{errorMessage}</Text>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.deleteButton, { marginTop: 20 }]}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={modalStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// Additional styles for the modals
const modalStyles = StyleSheet.create({
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
  modalText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
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
  deleteButton: {
    backgroundColor: "#FF5C5C",
  },
  buttonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
})

export default Footer

