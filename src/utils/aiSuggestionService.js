import api from './api';

// Cache for suggestions to avoid repeated API calls
const suggestionsCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Retry helper function
const retryAsync = async (fn, maxRetries = 2, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

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

    // Create cache key
    const cacheKey = `suggestions_${currentMessage}_${currentUserId}`;
    
    // Check if result is in cache and not expired
    if (suggestionsCache.has(cacheKey)) {
      const cached = suggestionsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
      } else {
        suggestionsCache.delete(cacheKey);
      }
    }

    // Limit recent messages to last 5 for faster processing
    const limitedMessages = recentMessages.slice(-5).map(msg => ({
      text: msg.text || msg.content || '',
      sender: msg.sender || msg.senderId || currentUserId,
      timestamp: msg.timestamp
    }));

    // Call backend API with retry logic
    const suggestions = await retryAsync(async () => {
      const response = await api.post('/chat/ai-suggestions', {
        currentMessage: currentMessage.trim().substring(0, 100), // Limit message length
        recentMessages: limitedMessages,
        currentUserId
      }, {
        timeout: 25000 // 25 seconds timeout for AI API calls
      });
      return response.data?.suggestions || [];
    }, 2);
    
    // Cache the result
    suggestionsCache.set(cacheKey, {
      data: suggestions,
      timestamp: Date.now()
    });

    return suggestions;
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
    // Limit recent messages to last 3 for faster processing
    const limitedMessages = recentMessages.slice(-3).map(msg => ({
      text: msg.text || msg.content || '',
      sender: msg.sender || msg.senderId || currentUserId,
      timestamp: msg.timestamp
    }));

    // Call backend API with retry logic
    const starters = await retryAsync(async () => {
      const response = await api.post('/chat/ai-conversation-starters', {
        recentMessages: limitedMessages,
        currentUserId
      }, {
        timeout: 20000 // 20 seconds timeout
      });
      return response.data?.suggestions || [];
    }, 2);

    return starters;
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

    // Create cache key
    const cacheKey = `reply_${message.substring(0, 50)}_${currentUserId}`;
    
    // Check if result is in cache and not expired
    if (suggestionsCache.has(cacheKey)) {
      const cached = suggestionsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
      } else {
        suggestionsCache.delete(cacheKey);
      }
    }

    // Limit recent messages to last 5 for faster processing
    const limitedMessages = recentMessages.slice(-5).map(msg => ({
      text: msg.text || msg.content || '',
      sender: msg.sender || msg.senderId || currentUserId,
      timestamp: msg.timestamp
    }));

    // Call backend API with retry logic
    const reply = await retryAsync(async () => {
      const response = await api.post('/chat/ai-reply', {
        message: message.trim().substring(0, 200), // Limit message length
        recentMessages: limitedMessages,
        currentUserId
      }, {
        timeout: 25000 // 25 seconds timeout
      });
      return response.data?.reply || '';
    }, 2);
    
    // Cache the result
    suggestionsCache.set(cacheKey, {
      data: reply,
      timestamp: Date.now()
    });

    return reply;
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return '';
  }
};
