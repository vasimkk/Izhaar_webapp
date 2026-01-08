import api from './api';

/**
 * Get AI suggestions for chat messages based on conversation context
 * @param {string} currentMessage - The current message the user is typing
 * @param {Array} recentMessages - Recent messages in the conversation (last 5-10 messages)
 * @param {string} currentUserId - The current user's ID for context
 * @returns {Promise<string[]>} Array of suggested message completions
 */
export const getAIChatSuggestions = async (currentMessage, recentMessages = [], currentUserId = '') => {
  try {
    // If message is empty or too short, return empty suggestions
    if (!currentMessage || currentMessage.trim().length < 2) {
      return [];
    }

    // Call backend API endpoint with longer timeout for AI suggestions
    const response = await api.post('/chat/ai-suggestions', {
      currentMessage,
      recentMessages,
      currentUserId
    }, {
      timeout: 30000 // 30 seconds timeout for AI API calls
    });

    return response.data?.suggestions || [];
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return empty array on error instead of throwing
    return [];
  }
};

/**
 * Get quick suggestions for empty or short messages (conversation starters)
 * @param {Array} recentMessages - Recent messages in the conversation
 * @param {string} currentUserId - The current user's ID for context
 * @returns {Promise<string[]>} Array of conversation starter suggestions
 */
export const getConversationStarters = async (recentMessages = [], currentUserId = '') => {
  try {
    // Call backend API endpoint with longer timeout for AI API calls
    const response = await api.post('/chat/ai-conversation-starters', {
      recentMessages,
      currentUserId
    }, {
      timeout: 30000 // 30 seconds timeout for AI API calls
    });

    return response.data?.suggestions || [];
  } catch (error) {
    console.error('Error getting conversation starters:', error);
    // Return empty array on error instead of throwing
    return [];
  }
};

/**
 * Generate AI reply for a received message
 * @param {string} message - The received message to reply to
 * @param {Array} recentMessages - Recent messages in the conversation
 * @param {string} currentUserId - The current user's ID for context
 * @returns {Promise<string>} AI-generated reply
 */
export const generateAiReply = async (message, recentMessages = [], currentUserId = '') => {
  try {
    if (!message || !message.trim()) {
      return '';
    }

    // Call backend API endpoint
    const response = await api.post('/chat/ai-reply', {
      message,
      recentMessages,
      currentUserId
    }, {
      timeout: 30000 // 30 seconds timeout for AI API calls
    });

    return response.data?.reply || '';
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return '';
  }
};
