import { sendOpenAIRequest, hasValidApiKey } from "./openaiService"

/**
 * Generate a response from the chatbot based on user input and conversation history
 * @param {string} userInput - The user's message
 * @param {Array} userSkills - Array of user skills
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} - The chatbot's response
 */
export const generateChatResponse = async (userInput, userSkills = [], conversationHistory = []) => {
  try {
    // Check if API key exists in .env
    const hasApiKey = hasValidApiKey()

    if (!hasApiKey) {
      return {
        text: "The AI assistant is not available at the moment. Please try again later or contact support.",
        isJson: false,
        error: true,
      }
    }

    // Enhance the user input with skills information if available
    let enhancedInput = userInput
    if (userSkills && userSkills.length > 0) {
      enhancedInput += `\n\nFor context, my skills include: ${userSkills.join(", ")}`
    }

    // Send request to OpenAI
    const response = await sendOpenAIRequest(enhancedInput, conversationHistory)

    try {
      // Try to parse as JSON
      const jsonResponse = JSON.parse(response)
      return {
        text: response,
        isJson: true,
        data: jsonResponse,
      }
    } catch (e) {
      // If not valid JSON, return as plain text
      return {
        text: response,
        isJson: false,
      }
    }
  } catch (error) {
    console.error("Error in generateChatResponse:", error)

    return {
      text: `I encountered an error: ${error.message}. Please try again later.`,
      isJson: false,
      error: true,
    }
  }
}

