import { View, Text, StyleSheet, Platform } from "react-native"
import { COLORS, FONT, SIZES } from "../../constants"
import JsonResponseRenderer from "./JsonResponseRenderer"

const ChatMessage = ({ message, darkMode, colors }) => {
  const isUser = message.isUser

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Check if the message contains JSON data
  const hasJsonData = !isUser && message.isJson && message.jsonData

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
      <View
        style={[
          styles.messageBubble,
          isUser
            ? [styles.userMessageBubble, { backgroundColor: COLORS.tertiary }]
            : [styles.botMessageBubble, { backgroundColor: darkMode ? colors.surface : COLORS.white }],
        ]}
      >
        {hasJsonData ? (
          // Render JSON data
          <JsonResponseRenderer jsonData={message.jsonData} darkMode={darkMode} colors={colors} />
        ) : (
          // Render regular text message
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : { color: darkMode ? colors.text : COLORS.primary },
            ]}
          >
            {message.text}
          </Text>
        )}
      </View>
      <Text style={[styles.timestamp, { color: darkMode ? colors.textSecondary : COLORS.gray }]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: SIZES.medium,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userMessageBubble: {
    borderBottomRightRadius: SIZES.small / 2,
  },
  botMessageBubble: {
    borderBottomLeftRadius: SIZES.small / 2,
  },
  messageText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  timestamp: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small - 2,
    marginTop: 4,
    marginHorizontal: 4,
  },
})

export default ChatMessage

