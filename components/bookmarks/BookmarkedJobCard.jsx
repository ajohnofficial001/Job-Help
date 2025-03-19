"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Modal, Platform } from "react-native"
import { useRouter } from "expo-router"
import { COLORS, FONT, SIZES, SHADOWS, icons } from "../../constants"
import { useBookmarks } from "../../context/BookmarkContext"
import { checkImageURL } from "../../utils"
import DeadlineIndicator from "./DeadlineIndicator"
import StatusBadge from "./StatusBadge"

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

const BookmarkedJobCard = ({ job, darkMode, colors, isActive }) => {
  const router = useRouter()
  const { removeBookmark, markAsCompleted, moveToActive, updateBookmark } = useBookmarks()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [showWebDateModal, setShowWebDateModal] = useState(false)
  const [webDate, setWebDate] = useState("")
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showMoveToActiveModal, setShowMoveToActiveModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    if (!job.deadline) return null

    const today = new Date()
    const deadline = new Date(job.deadline)
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Handle job card press
  const handlePress = () => {
    router.push(`/job-details/${job.job_id}`)
  }

  // Handle remove bookmark
  const handleRemove = () => {
    setShowRemoveModal(true)
  }

  const confirmRemove = async () => {
    try {
      const result = await removeBookmark(job.job_id)
      if (!result.success) {
        setErrorMessage(result.error || "Failed to remove job")
        setShowErrorModal(true)
      } else {
        setSuccessMessage("Job removed successfully")
        setShowSuccessModal(true)
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
    } finally {
      setShowRemoveModal(false)
    }
  }

  // Handle mark as completed
  const handleMarkAsCompleted = () => {
    setShowCompleteModal(true)
  }

  const confirmMarkAsCompleted = async () => {
    try {
      const result = await markAsCompleted(job.job_id)
      if (!result.success) {
        setErrorMessage(result.error || "Failed to mark as completed")
        setShowErrorModal(true)
      } else {
        setSuccessMessage("Job marked as completed")
        setShowSuccessModal(true)
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
    } finally {
      setShowCompleteModal(false)
    }
  }

  // Handle move to active
  const handleMoveToActive = () => {
    setShowMoveToActiveModal(true)
  }

  const confirmMoveToActive = async () => {
    try {
      const result = await moveToActive(job.job_id)
      if (!result.success) {
        setErrorMessage(result.error || "Failed to move to active")
        setShowErrorModal(true)
      } else {
        setSuccessMessage("Job moved to active applications")
        setShowSuccessModal(true)
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred")
      setShowErrorModal(true)
    } finally {
      setShowMoveToActiveModal(false)
    }
  }

  // Handle update status
  const handleUpdateStatus = () => {
    if (!isActive) return
    setShowStatusModal(true)
  }

  // Update application status
  const updateStatus = async (status) => {
    setShowStatusModal(false)
    const result = await updateBookmark(job.job_id, { application_status: status })
    if (!result.success) {
      setErrorMessage(result.error || "Failed to update status")
      setShowErrorModal(true)
    } else {
      setSuccessMessage(`Status updated to ${status}`)
      setShowSuccessModal(true)
    }
  }

  // Handle update deadline
  const handleUpdateDeadline = () => {
    if (!isActive) return

    if (Platform.OS === "web") {
      // For web, show a modal with date input
      setWebDate(job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "")
      setShowWebDateModal(true)
    } else {
      // For native, show the date picker
      setDatePickerVisible(true)
    }
  }

  // Handle date selection from native picker
  const handleConfirmDate = async (date) => {
    setDatePickerVisible(false)

    const result = await updateBookmark(job.job_id, { deadline: date.toISOString() })
    if (!result.success) {
      setErrorMessage(result.error || "Failed to update deadline")
      setShowErrorModal(true)
    } else {
      setSuccessMessage("Deadline updated successfully")
      setShowSuccessModal(true)
    }
  }

  // Handle date cancellation from native picker
  const handleCancelDate = () => {
    setDatePickerVisible(false)
  }

  // Handle web date submission
  const handleWebDateSubmit = async () => {
    console.log("Web date submit triggered", { webDate })
    setShowWebDateModal(false)

    try {
      let deadline = null
      if (webDate) {
        deadline = new Date(webDate).toISOString()
      }

      console.log("Updating bookmark with deadline:", deadline)
      const result = await updateBookmark(job.job_id, { deadline })
      console.log("Update result:", result)

      if (!result.success) {
        setErrorMessage("Failed to update deadline")
        setShowErrorModal(true)
      } else {
        setSuccessMessage("Deadline updated successfully")
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error("Error updating deadline:", error)
      setErrorMessage("Invalid date format")
      setShowErrorModal(true)
    }
  }

  // Clear deadline
  const clearDeadline = async () => {
    const result = await updateBookmark(job.job_id, { deadline: null })
    if (!result.success) {
      setErrorMessage("Failed to clear deadline")
      setShowErrorModal(true)
    } else {
      setSuccessMessage("Deadline cleared")
      setShowSuccessModal(true)
    }
    setShowWebDateModal(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? colors.surface : COLORS.white }]}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.logoContainer} onPress={handlePress}>
              <Image
                source={{
                  uri: checkImageURL(job.employer_logo)
                    ? job.employer_logo
                    : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
                }}
                resizeMode="contain"
                style={styles.logoImage}
              />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={[styles.jobTitle, { color: darkMode ? colors.text : COLORS.primary }]} numberOfLines={1}>
                {job.job_title}
              </Text>

              <Text
                style={[styles.companyName, { color: darkMode ? colors.textSecondary : COLORS.gray }]}
                numberOfLines={1}
              >
                {job.employer_name}
              </Text>

              <View style={styles.locationContainer}>
                <Image
                  source={icons.location}
                  resizeMode="contain"
                  style={[styles.locationIcon, { tintColor: darkMode ? colors.textSecondary : COLORS.gray }]}
                />
                <Text
                  style={[styles.locationText, { color: darkMode ? colors.textSecondary : COLORS.gray }]}
                  numberOfLines={1}
                >
                  {job.job_country || "Location not specified"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            <StatusBadge status={job.application_status} />
            <Image
              source={isExpanded ? icons.chevronUp : icons.chevronRight}
              style={[styles.expandIcon, { tintColor: darkMode ? colors.textSecondary : COLORS.gray }]}
            />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.deadlineContainer}>
            <Text style={[styles.deadlineLabel, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
              Deadline:
            </Text>
            <Text style={[styles.deadlineText, { color: darkMode ? colors.text : COLORS.primary }]}>
              {formatDate(job.deadline)}
            </Text>

            {isActive && job.deadline && <DeadlineIndicator daysRemaining={getDaysUntilDeadline()} />}

            {isActive && (
              <TouchableOpacity style={styles.editButton} onPress={handleUpdateDeadline}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {job.notes && (
            <View style={styles.notesContainer}>
              <Text style={[styles.notesLabel, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>Notes:</Text>
              <Text style={[styles.notesText, { color: darkMode ? colors.text : COLORS.primary }]}>{job.notes}</Text>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={handlePress}>
              <Text style={styles.actionButtonText}>View Job</Text>
            </TouchableOpacity>

            {isActive ? (
              <>
                <TouchableOpacity style={[styles.actionButton, styles.statusButton]} onPress={handleUpdateStatus}>
                  <Text style={styles.actionButtonText}>Update Status</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.completeButton]} onPress={handleMarkAsCompleted}>
                  <Text style={styles.actionButtonText}>Mark Completed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={handleRemove}>
                  <Text style={styles.actionButtonText}>Remove</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={[styles.actionButton, styles.moveButton]} onPress={handleMoveToActive}>
                <Text style={styles.actionButtonText}>Move to Active</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

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
        visible={showWebDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWebDateModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Set Application Deadline</Text>

            <Text style={modalStyles.label}>Deadline Date</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="YYYY-MM-DD"
              value={webDate}
              onChangeText={setWebDate}
              // On web, use the native date input
              {...(Platform.OS === "web" ? { type: "date" } : {})}
            />

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity style={[modalStyles.button, modalStyles.clearButton]} onPress={clearDeadline}>
                <Text style={modalStyles.buttonText}>Clear Deadline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowWebDateModal(false)}
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

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Update Application Status</Text>
            <Text style={modalStyles.modalText}>Select the current status of your application:</Text>

            <View style={modalStyles.statusButtonsContainer}>
              <TouchableOpacity style={modalStyles.statusButton} onPress={() => updateStatus("Saved")}>
                <Text style={modalStyles.statusButtonText}>Saved</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.statusButton} onPress={() => updateStatus("Applied")}>
                <Text style={modalStyles.statusButtonText}>Applied</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.statusButton} onPress={() => updateStatus("Interviewing")}>
                <Text style={modalStyles.statusButtonText}>Interviewing</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.statusButton} onPress={() => updateStatus("Offer")}>
                <Text style={modalStyles.statusButtonText}>Offer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.statusButton} onPress={() => updateStatus("Rejected")}>
                <Text style={modalStyles.statusButtonText}>Rejected</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton, { marginTop: 20 }]}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={modalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Remove Job</Text>
            <Text style={modalStyles.modalText}>Are you sure you want to remove this job from your bookmarks?</Text>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowRemoveModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.button, modalStyles.deleteButton]} onPress={confirmRemove}>
                <Text style={modalStyles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mark as Completed Confirmation Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Mark as Completed</Text>
            <Text style={modalStyles.modalText}>Have you completed this application?</Text>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowCompleteModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.button, modalStyles.saveButton]} onPress={confirmMarkAsCompleted}>
                <Text style={modalStyles.buttonText}>Yes, Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Move to Active Confirmation Modal */}
      <Modal
        visible={showMoveToActiveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMoveToActiveModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Move to Active</Text>
            <Text style={modalStyles.modalText}>Do you want to move this application back to active?</Text>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setShowMoveToActiveModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.button, modalStyles.saveButton]} onPress={confirmMoveToActive}>
                <Text style={modalStyles.buttonText}>Move to Active</Text>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "70%",
    height: "70%",
  },
  textContainer: {
    marginLeft: SIZES.medium,
    flex: 1,
  },
  jobTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  companyName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small + 2,
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 2,
  },
  locationText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandIcon: {
    width: 20,
    height: 20,
    marginLeft: SIZES.small,
  },
  expandedContent: {
    marginTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
    paddingTop: SIZES.medium,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  deadlineLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 2,
    marginRight: SIZES.small / 2,
  },
  deadlineText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 2,
  },
  notesContainer: {
    marginBottom: SIZES.small,
  },
  notesLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small + 2,
    marginBottom: SIZES.small / 2,
  },
  notesText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small + 2,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SIZES.small,
  },
  actionButton: {
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
  },
  statusButton: {
    backgroundColor: COLORS.secondary,
  },
  completeButton: {
    backgroundColor: COLORS.tertiary,
  },
  removeButton: {
    backgroundColor: "#FF5C5C",
  },
  moveButton: {
    backgroundColor: COLORS.tertiary,
  },
  actionButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  editButton: {
    marginLeft: SIZES.small,
    paddingVertical: SIZES.small / 4,
    paddingHorizontal: SIZES.small / 2,
    backgroundColor: COLORS.tertiary + "30",
    borderRadius: SIZES.small / 2,
  },
  editButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small - 2,
    color: COLORS.tertiary,
  },
})

// Web-specific styles for the date modal
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    marginHorizontal: SIZES.small / 4,
  },
  clearButton: {
    backgroundColor: COLORS.gray,
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
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  statusButtonsContainer: {
    marginVertical: SIZES.medium,
  },
  statusButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    alignItems: "center",
  },
  statusButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
})

export default BookmarkedJobCard

