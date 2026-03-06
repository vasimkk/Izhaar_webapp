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

/**
 * Generate AI reply specifically for the Izhaar Love Coach
 * @param {string} message - The user's message
 * @param {Array} history - Recent chat history
 * @returns {Promise<string>} AI Coach reply
 */
export const getLoveCoachReply = async (message, history = [], currentUserId = '') => {
  try {
    if (!message || !message.trim()) return '';

    // Limit and format history for the AI
    const formattedHistory = history.slice(-5).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || msg.content || '' }]
    }));

    const response = await api.post('/chat/love-coach', {
      message: message.trim(),
      history: formattedHistory,
      currentUserId
    }, {
      timeout: 30000
    });

    return response.data?.reply || '';
  } catch (error) {
    console.error('Error in Love Coach AI:', error);
    // Fallback to generic reply if specialized one fails
    return generateAiReply(message, history, currentUserId);
  }
};

/**
 * Generate a complete Izhaar Page configuration using AI
 * @param {string} prompt - User's description of the moment
 * @returns {Promise<Object>} Generated page configuration
 */
export const generateIzhaarPageMagic = async (prompt, currentUserId = '') => {
  try {
    if (!prompt || !prompt.trim()) return null;

    const response = await api.post('/chat/izhaar-magic', {
      prompt: prompt.trim(),
      currentUserId
    }, {
      timeout: 35000
    });

    return response.data?.config || null;
  } catch (error) {
    console.error('Error generating AI Izhaar Page:', error);
    return null;
  }
};

/**
 * Generate a real-time Zodiac Vibe based on user profile name
 * @param {string} userName - The user's profile name
 * @returns {Promise<Object>} Generated vibe data
 */
export const getZodiacVibe = async (userName, currentUserId = '', dob = null) => {
  try {
    const response = await api.post('/zodiac-vibe', {
      userName,
      currentUserId,
      dob
    }, {
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    // Fallback: Calculate real sign from DOB if possible, and generate a name-based vibe
    const getSignFromDob = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
      return null;
    };

    const calculatedSign = getSignFromDob(dob);
    const today = new Date().toDateString();
    const seed = `${userName}_${today}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const vibePercent = Math.abs(hash % 41) + 60; // 60-100%
    return {
      vibe: `${vibePercent}%`,
      emoji: vibePercent > 90 ? '🔥' : vibePercent > 80 ? '✨' : '💫',
      userSign: calculatedSign || "Aries"
    };
  }
};