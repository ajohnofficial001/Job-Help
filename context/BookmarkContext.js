"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create the bookmark context
const BookmarkContext = createContext()

// Custom hook to use the bookmark context
export const useBookmarks = () => useContext(BookmarkContext)

// Bookmark provider component
export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [completedApplications, setCompletedApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load bookmarks and completed applications from storage on mount
  useEffect(() => {
    loadBookmarks()
  }, [])

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    setIsLoading(true)
    try {
      const storedBookmarks = await AsyncStorage.getItem("bookmarkedJobs")
      const storedCompleted = await AsyncStorage.getItem("completedApplications")

      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks))
      }

      if (storedCompleted) {
        setCompletedApplications(JSON.parse(storedCompleted))
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save bookmarks to AsyncStorage
  const saveBookmarks = async (updatedBookmarks) => {
    try {
      console.log("Saving bookmarks to AsyncStorage")
      await AsyncStorage.setItem("bookmarkedJobs", JSON.stringify(updatedBookmarks))
      console.log("Bookmarks saved, updating state")
      setBookmarks(updatedBookmarks)
      return true
    } catch (error) {
      console.error("Error saving bookmarks:", error)
      return false
    }
  }

  // Save completed applications to AsyncStorage
  const saveCompletedApplications = async (updatedCompleted) => {
    try {
      await AsyncStorage.setItem("completedApplications", JSON.stringify(updatedCompleted))
      setCompletedApplications(updatedCompleted)
      return true
    } catch (error) {
      console.error("Error saving completed applications:", error)
      return false
    }
  }

  // Add a job to bookmarks
  const addBookmark = async (job, deadline = null, notes = "") => {
    try {
      console.log("Adding bookmark:", { job, deadline, notes })

      // Check if job is already bookmarked
      const isAlreadyBookmarked = bookmarks.some((bookmark) => bookmark.job_id === job.job_id)

      if (isAlreadyBookmarked) {
        console.log("Job already bookmarked")
        return { success: false, error: "Job already bookmarked" }
      }

      // Add deadline and notes to the job object
      const bookmarkedJob = {
        ...job,
        bookmarked_at: new Date().toISOString(),
        deadline: deadline,
        notes: notes,
        application_status: "Saved", // Initial status
      }

      console.log("Saving bookmarked job:", bookmarkedJob)
      const updatedBookmarks = [...bookmarks, bookmarkedJob]
      const success = await saveBookmarks(updatedBookmarks)
      console.log("Save result:", success)

      return { success, error: success ? null : "Failed to save bookmark" }
    } catch (error) {
      console.error("Error in addBookmark:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  // Remove a job from bookmarks
  const removeBookmark = async (jobId) => {
    try {
      const updatedBookmarks = bookmarks.filter((job) => job.job_id !== jobId)
      const success = await saveBookmarks(updatedBookmarks)

      return { success, error: success ? null : "Failed to remove bookmark" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Update bookmark details (deadline, notes, status)
  const updateBookmark = async (jobId, updates) => {
    try {
      const updatedBookmarks = bookmarks.map((job) => {
        if (job.job_id === jobId) {
          return { ...job, ...updates }
        }
        return job
      })

      const success = await saveBookmarks(updatedBookmarks)

      return { success, error: success ? null : "Failed to update bookmark" }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Mark a job application as completed
  const markAsCompleted = async (jobId) => {
    try {
      // Find the job in bookmarks
      const job = bookmarks.find((job) => job.job_id === jobId)

      if (!job) {
        return { success: false, error: "Job not found" }
      }

      // Add completion date
      const completedJob = {
        ...job,
        completed_at: new Date().toISOString(),
        application_status: "Completed",
      }

      // Add to completed applications
      const updatedCompleted = [...completedApplications, completedJob]
      const successCompleted = await saveCompletedApplications(updatedCompleted)

      // Remove from active bookmarks
      const updatedBookmarks = bookmarks.filter((job) => job.job_id !== jobId)
      const successBookmarks = await saveBookmarks(updatedBookmarks)

      return {
        success: successCompleted && successBookmarks,
        error: successCompleted && successBookmarks ? null : "Failed to mark as completed",
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Move a completed application back to active bookmarks
  const moveToActive = async (jobId) => {
    try {
      // Find the job in completed applications
      const job = completedApplications.find((job) => job.job_id === jobId)

      if (!job) {
        return { success: false, error: "Job not found" }
      }

      // Remove completion date and update status
      const { completed_at, ...activeJob } = job
      activeJob.application_status = "In Progress"

      // Add to active bookmarks
      const updatedBookmarks = [...bookmarks, activeJob]
      const successBookmarks = await saveBookmarks(updatedBookmarks)

      // Remove from completed applications
      const updatedCompleted = completedApplications.filter((job) => job.job_id !== jobId)
      const successCompleted = await saveCompletedApplications(updatedCompleted)

      return {
        success: successBookmarks && successCompleted,
        error: successBookmarks && successCompleted ? null : "Failed to move to active",
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Check if a job is bookmarked
  const isBookmarked = (jobId) => {
    return bookmarks.some((job) => job.job_id === jobId)
  }

  // Get a bookmarked job by ID
  const getBookmark = (jobId) => {
    return bookmarks.find((job) => job.job_id === jobId) || null
  }

  // Get a completed application by ID
  const getCompletedApplication = (jobId) => {
    return completedApplications.find((job) => job.job_id === jobId) || null
  }

  // Sort bookmarks by deadline (closest first)
  const getBookmarksSortedByDeadline = () => {
    return [...bookmarks].sort((a, b) => {
      // Jobs without deadlines go to the end
      if (!a.deadline) return 1
      if (!b.deadline) return -1

      // Sort by deadline (ascending)
      return new Date(a.deadline) - new Date(b.deadline)
    })
  }

  const value = {
    bookmarks,
    completedApplications,
    isLoading,
    addBookmark,
    removeBookmark,
    updateBookmark,
    markAsCompleted,
    moveToActive,
    isBookmarked,
    getBookmark,
    getCompletedApplication,
    getBookmarksSortedByDeadline,
    refreshBookmarks: loadBookmarks,
  }

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
}

export default BookmarkContext

