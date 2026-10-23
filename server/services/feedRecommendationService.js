// This service handles feed recommendation logic
// It implements a simple scoring system as described in the requirements

class FeedRecommendationService {
  recommendPosts(posts, userInterests, focusMode, discoveryLevel, userId) {
    const knownInterests = [
      'Technology', 'Science', 'Education', 'Sports', 'Art',
      'Entertainment', 'Personal Stories', 'Social Causes'
    ];
    const savedInterests = Array.isArray(userInterests) ? userInterests : [];
    const primaryInterests = focusMode === 'Explore'
      ? savedInterests
      : knownInterests.includes(focusMode) ? [focusMode] : savedInterests;

    const scoredPosts = posts.map(post => {
      let score = 0;

      if (primaryInterests.includes(post.interest)) score += 50;
      if (savedInterests.includes(post.interest)) score += 20;

      const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      if (ageInHours < 24) {
        score += 5;
      }

      if ((post.likes || []).length < 10) {
        score += 5;
      }

      return {
        ...post.toObject(),
        recommendationScore: score,
        recommendationReason: this.generateReason(post, primaryInterests, focusMode)
      };
    });

    if (primaryInterests.length === 0) {
      return scoredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const matchedPosts = scoredPosts.filter(post => primaryInterests.includes(post.interest));
    const otherPosts = scoredPosts.filter(post => !primaryInterests.includes(post.interest));
    let filteredPosts;

    switch (discoveryLevel) {
      case 'Focus Only':
        filteredPosts = matchedPosts;
        break;
      case 'Mostly My Interests':
        filteredPosts = [...matchedPosts, ...otherPosts.slice(0, Math.ceil(otherPosts.length * 0.2))];
        break;
      case 'Balanced':
        filteredPosts = [...matchedPosts, ...otherPosts.slice(0, Math.ceil(otherPosts.length * 0.3))];
        break;
      case 'Explore More':
        filteredPosts = [...matchedPosts, ...otherPosts.slice(0, Math.ceil(otherPosts.length * 0.5))];
        break;
      default:
        filteredPosts = [...matchedPosts, ...otherPosts.slice(0, Math.ceil(otherPosts.length * 0.3))];
    }

    filteredPosts.sort((a, b) => (
      b.recommendationScore - a.recommendationScore
      || new Date(b.createdAt) - new Date(a.createdAt)
    ));
    return filteredPosts;
  }
  
  generateReason(post, userInterests, focusMode) {
    const reasons = [];
    
    if (userInterests.includes(post.interest)) {
      reasons.push(`Matches your ${post.interest} interest`);
    }

    if (focusMode === post.interest) {
      reasons.push(`Matches your current Focus Mode`);
    }

    if (post.sponsored) {
      reasons.push('Sponsored content');
    }
    
    if (post.aiLabel && post.aiLabel !== 'Human Created') {
      reasons.push(`AI ${post.aiLabel.toLowerCase()}`);
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'General content';
  }
}

module.exports = new FeedRecommendationService();