// This service handles feed recommendation logic
// It implements a simple scoring system as described in the requirements

class FeedRecommendationService {
  recommendPosts(posts, userInterests, focusMode, discoveryLevel, userId) {
    // If no user interests, return all posts
    if (!userInterests || userInterests.length === 0) {
      return posts;
    }
    
    // Calculate scores for each post
    const scoredPosts = posts.map(post => {
      let score = 0;
      
      // Interest match (50 points)
      if (userInterests.includes(post.interest)) {
        score += 50;
      }
      
      // Focus mode match (30 points)
      // In a real implementation, this would check against the user's current focus mode
      // For now, we'll assume it matches if the post interest is in user interests
      if (userInterests.includes(post.interest)) {
        score += 30;
      }
      
      // Community match (10 points)
      // In a real implementation, this would check if the post is from a community the user follows
      // For now, we'll skip this as we don't have community data in the post model
      
      // Freshness (5 points) - newer posts get higher score
      const ageInHours = (Date.now() - post.createdAt) / (1000 * 60 * 60);
      if (ageInHours < 24) {
        score += 5;
      }
      
      // Limited engagement (5 points) - posts with fewer likes get higher score to promote diverse content
      if (post.likes.length < 10) {
        score += 5;
      }
      
      return {
        ...post.toObject(),
        recommendationScore: score,
        recommendationReason: this.generateReason(post, userInterests, focusMode)
      };
    });
    
    // Apply discovery level
    let filteredPosts = scoredPosts;
    
    switch (discoveryLevel) {
      case 'Focus Only':
        // Only posts from user's interests
        filteredPosts = scoredPosts.filter(post => userInterests.includes(post.interest));
        break;
      case 'Mostly My Interests':
        // Mostly interests with limited exploration
        filteredPosts = scoredPosts.filter(post => userInterests.includes(post.interest));
        // Add 20% of posts from other interests
        const otherPosts = scoredPosts.filter(post => !userInterests.includes(post.interest));
        filteredPosts = [...filteredPosts, ...otherPosts.slice(0, Math.ceil(otherPosts.length * 0.2))];
        break;
      case 'Balanced':
        // Mix of relevant and new topics
        const interestPosts = scoredPosts.filter(post => userInterests.includes(post.interest));
        const nonInterestPosts = scoredPosts.filter(post => !userInterests.includes(post.interest));
        filteredPosts = [...interestPosts, ...nonInterestPosts.slice(0, Math.ceil(nonInterestPosts.length * 0.3))];
        break;
      case 'Explore More':
        // Allow more content outside current interests
        const interestPosts2 = scoredPosts.filter(post => userInterests.includes(post.interest));
        const nonInterestPosts2 = scoredPosts.filter(post => !userInterests.includes(post.interest));
        filteredPosts = [...interestPosts2, ...nonInterestPosts2.slice(0, Math.ceil(nonInterestPosts2.length * 0.5))];
        break;
      default:
        // Default to balanced
        const interestPosts3 = scoredPosts.filter(post => userInterests.includes(post.interest));
        const nonInterestPosts3 = scoredPosts.filter(post => !userInterests.includes(post.interest));
        filteredPosts = [...interestPosts3, ...nonInterestPosts3.slice(0, Math.ceil(nonInterestPosts3.length * 0.3))];
    }
    
    // Sort by score
    filteredPosts.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return filteredPosts;
  }
  
  generateReason(post, userInterests, focusMode) {
    const reasons = [];
    
    if (userInterests.includes(post.interest)) {
      reasons.push(`Matches your ${post.interest} interest`);
    }
    
    if (focusMode && userInterests.includes(post.interest)) {
      reasons.push(`Matches your current Focus Mode`);
    }
    
    // Add more reasons based on other factors
    if (post.sponsored) {
      reasons.push('Sponsored content');
    }
    
    if (post.aiLabel !== 'Human Created') {
      reasons.push(`AI ${post.aiLabel.toLowerCase()}`);
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'General content';
  }
}

module.exports = new FeedRecommendationService();