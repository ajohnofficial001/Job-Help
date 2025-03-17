"use client"

import { useState, useCallback } from "react"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { COLORS, FONT, SIZES, icons } from "../../constants"
import { ScreenHeaderBtn } from "../../components"
import { useTheme } from "../../context/ThemeContext"
import { useBookmarks } from "../../context/BookmarkContext"
import BookmarkedJobCard from "../../components/bookmarks/BookmarkedJobCard"
import EmptyState from "../../components/bookmarks/EmptyState"

const BookmarksScreen = () => {
  const router = useRouter()
  const { darkMode, colors } = useTheme()
  const { bookmarks, completedApplications, isLoading, getBookmarksSortedByDeadline, refreshBookmarks } = useBookmarks()

  const [activeTab, setActiveTab] = useState("active")
  const [refreshing, setRefreshing] = useState(false)
  const [sortByDeadline, setSortByDeadline] = useState(true)

  // Get sorted bookmarks
  const sortedBookmarks = sortByDeadline
    ? getBookmarksSortedByDeadline()
    : [...bookmarks].sort((a, b) => new Date(b.bookmarked_at) - new Date(a.bookmarked_at))

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshBookmarks()
    setRefreshing(false)
  }, [refreshBookmarks])

  // Toggle sort method
  const toggleSortMethod = () => {
    setSortByDeadline(!sortByDeadline)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? colors.background : COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: darkMode ? colors.background : COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <ScreenHeaderBtn iconUrl={icons.left} dimension="60%" handlePress={() => router.back()} />,
          headerRight: () => (
            <TouchableOpacity style={styles.sortButton} onPress={toggleSortMethod}>
              <Image
                source={icons.filter}
                style={[styles.sortIcon, { tintColor: darkMode ? colors.text : COLORS.primary }]}
              />
              <Text style={[styles.sortText, { color: darkMode ? colors.text : COLORS.primary }]}>
                Sort by {sortByDeadline ? "Deadline" : "Date Saved"}
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />

      <View style={styles.container}>
        <Text style={[styles.title, { color: darkMode ? colors.text : COLORS.primary }]}>My Applications</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "active" && styles.activeTab,
              { borderColor: darkMode ? colors.textSecondary : COLORS.gray2 },
            ]}
            onPress={() => setActiveTab("active")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "active" && styles.activeTabText,
                { color: activeTab === "active" ? COLORS.tertiary : darkMode ? colors.textSecondary : COLORS.gray },
              ]}
            >
              Active ({bookmarks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "completed" && styles.activeTab,
              { borderColor: darkMode ? colors.textSecondary : COLORS.gray2 },
            ]}
            onPress={() => setActiveTab("completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "completed" && styles.activeTabText,
                { color: activeTab === "completed" ? COLORS.tertiary : darkMode ? colors.textSecondary : COLORS.gray },
              ]}
            >
              Completed ({completedApplications.length})
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.tertiary} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.scrollContent}
          >
            {activeTab === "active" ? (
              // Active applications
              sortedBookmarks.length > 0 ? (
                sortedBookmarks.map((job) => (
                  <BookmarkedJobCard key={job.job_id} job={job} darkMode={darkMode} colors={colors} isActive={true} />
                ))
              ) : (
                <EmptyState
                  message="You haven't saved any jobs yet"
                  buttonText="Find Jobs"
                  onPress={() => router.push("/")}
                  darkMode={darkMode}
                  colors={colors}
                />
              )
            ) : // Completed applications
            completedApplications.length > 0 ? (
              completedApplications.map((job) => (
                <BookmarkedJobCard key={job.job_id} job={job} darkMode={darkMode} colors={colors} isActive={false} />
              ))
            ) : (
              <EmptyState
                message="You haven't completed any applications yet"
                buttonText="View Active Applications"
                onPress={() => setActiveTab("active")}
                darkMode={darkMode}
                colors={colors}
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    marginBottom: SIZES.medium,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: SIZES.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderBottomWidth: 2,
    borderColor: COLORS.gray2,
    alignItems: "center",
  },
  activeTab: {
    borderColor: COLORS.tertiary,
  },
  tabText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
  },
  activeTabText: {
    color: COLORS.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.small,
  },
  sortIcon: {
    width: 20,
    height: 20,
    marginRight: SIZES.small / 2,
  },
  sortText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
  },
})

export default BookmarksScreen

