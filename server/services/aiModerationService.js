// This service handles AI content moderation
// In a real implementation, this would connect to an AI service API
// For this demo, we'll implement a mock version

class AIModerationService {
  async moderateContent(content) {
    // Check if we're in mock mode (no API key)
    if (process.env.AI_API_KEY === 'mock' || !process.env.AI_API_KEY) {
      return this.mockModerate(content);
    }
    
    // In a real implementation, this would call an AI service
    // For now, we'll return a mock response
    return this.mockModerate(content);
  }
  
  mockModerate(content) {
    // Simple mock logic based on keywords
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('hate') || lowerContent.includes('violence') || lowerContent.includes('abuse')) {
      return {
        status: 'RESTRICTED',
        confidence: 0.95,
        reason: 'Potentially harmful content detected'
      };
    }
    
    if (lowerContent.includes('spam') || lowerContent.includes('fake') || lowerContent.includes('scam')) {
      return {
        status: 'REVIEW',
        confidence: 0.85,
        reason: 'Potentially spam or misleading content'
      };
    }
    
    return {
      status: 'SAFE',
      confidence: 0.92,
      reason: 'No obvious harmful content detected'
    };
  }
}

module.exports = new AIModerationService();