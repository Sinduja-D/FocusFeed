const Post = require('../models/Post');

class EngagementDetectionService {
  async detectUnusualEngagement() {
    // In a real implementation, this would analyze engagement patterns
    // For this demo, we'll implement a simple mock version
    
    const posts = await Post.find();
    const unusualEngagement = [];
    
    for (const post of posts) {
      // Mock logic based on engagement metrics
      let riskScore = 0;
      let riskReasons = [];
      
      // Sudden large increase in likes
      if (post.likes.length > 100 && Math.random() > 0.7) {
        riskScore += 40;
        riskReasons.push('Sudden increase in likes');
      }
      
      // High engagement relative to account age (in a real app, we'd check user's posting history)
      // For demo, we'll simulate this
      if (post.likes.length > 50 && Math.random() > 0.6) {
        riskScore += 30;
        riskReasons.push('High engagement for new content');
      }
      
      // Repeated interactions from same accounts (in a real app, we'd check user interactions)
      // For demo, we'll simulate this
      if (Math.random() > 0.8) {
        riskScore += 35;
        riskReasons.push('Unusual engagement pattern');
      }
      
      // Determine engagement level
      let engagementLevel = 'Normal';
      if (riskScore > 50) {
        engagementLevel = 'Unusual Engagement Pattern';
      }
      
      if (engagementLevel !== 'Normal') {
        unusualEngagement.push({
          post,
          engagementLevel,
          riskScore,
          riskReasons
        });
      }
    }
    
    return unusualEngagement;
  }
  
  async getPostEngagementStatus(postId) {
    // In a real implementation, this would analyze the specific post's engagement
    // For this demo, we'll return a mock response
    
    const post = await Post.findById(postId);
    
    // Mock logic
    if (post.likes.length > 100) {
      return {
        status: 'Unusual Engagement Pattern',
        reasons: ['High number of likes']
      };
    }
    
    return {
      status: 'Normal Engagement',
      reasons: []
    };
  }
}

module.exports = new EngagementDetectionService();