import { API_ENDPOINTS } from './constants';

export const generateFeedQuery = (preferences) => {
  const params = new URLSearchParams();
  
  if (preferences.focusMode) {
    params.append('focusMode', preferences.focusMode);
  }
  
  if (preferences.discoveryLevel) {
    params.append('discoveryLevel', preferences.discoveryLevel);
  }
  
  if (preferences.interests && preferences.interests.length > 0) {
    params.append('interest', preferences.interests[0]);
  }
  
  return params.toString();
};

export const calculateRelevanceScore = (post, userPreferences) => {
  let score = 0;
  
  // Interest match
  if (userPreferences.interests.includes(post.interest)) {
    score += 40;
  }
  
  // Focus mode match
  if (post.interest === userPreferences.focusMode) {
    score += 30;
  }
  
  // Engagement score (likes, comments, shares)
  const engagement = post.likes.length + post.comments.length * 2 + post.shares * 3;
  score += Math.min(engagement / 10, 20);
  
  // Recency bonus (newer posts get higher score)
  const postAge = Date.now() - new Date(post.createdAt).getTime();
  const ageScore = Math.max(0, 10 - postAge / (1000 * 60 * 60 * 24)); // Decreases over days
  score += ageScore;
  
  // AI content consideration
  if (post.aiLabel === 'AI Generated') {
    score -= 5; // Slight penalty for AI-generated content
  }
  
  // Safety status consideration
  if (post.moderationStatus === 'RESTRICTED') {
    score -= 15; // Significant penalty for restricted content
  }
  
  return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
};

export const sortFeedByRelevance = (posts, userPreferences) => {
  return [...posts].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, userPreferences);
    const scoreB = calculateRelevanceScore(b, userPreferences);
    return scoreB - scoreA;
  });
};

export const filterFeedByDiscoveryLevel = (posts, discoveryLevel) => {
  switch (discoveryLevel) {
    case 'Focus Only':
      return posts.filter(post => post.interest === 'Technology'); // Should use user's focus mode
    case 'Mostly My Interests':
      return posts.filter(post => 
        post.interest === 'Technology' || // Should use user's interests
        Math.random() > 0.7 // 30% exploration
      );
    case 'Balanced':
      return posts.filter(post => 
        post.interest === 'Technology' || // Should use user's interests
        Math.random() > 0.5 // 50% exploration
      );
    case 'Explore More':
      return posts; // Show all content
    default:
      return posts;
  }
};

export const explainFeedRecommendation = (post, userPreferences) => {
  const reasons = [];
  
  if (userPreferences.interests.includes(post.interest)) {
    reasons.push(`Matches your ${post.interest} interest`);
  }
  
  if (post.interest === userPreferences.focusMode) {
    reasons.push(`Aligns with your current focus on ${userPreferences.focusMode}`);
  }
  
  if (post.likes.length > 10) {
    reasons.push('Popular with other users');
  }
  
  if (post.comments.length > 5) {
    reasons.push('Active discussion');
  }
  
  if (post.shares > 3) {
    reasons.push('Highly shared content');
  }
  
  if (post.aiLabel !== 'Human Created') {
    reasons.push('AI-assisted content');
  }
  
  if (post.moderationStatus === 'SAFE') {
    reasons.push('Passed safety checks');
  }
  
  return reasons;
};

export const detectUnusualEngagement = (post, baselineMetrics) => {
  const metrics = {
    likes: post.likes.length,
    comments: post.comments.length,
    shares: post.shares,
    velocity: calculateEngagementVelocity(post)
  };
  
  const anomalies = [];
  
  if (metrics.likes > baselineMetrics.avgLikes * 3) {
    anomalies.push('Unusually high likes');
  }
  
  if (metrics.comments > baselineMetrics.avgComments * 4) {
    anomalies.push('Unusually high comments');
  }
  
  if (metrics.shares > baselineMetrics.avgShares * 5) {
    anomalies.push('Unusually high shares');
  }
  
  if (metrics.velocity > baselineMetrics.avgVelocity * 2) {
    anomalies.push('Rapid engagement velocity');
  }
  
  return {
    isUnusual: anomalies.length > 0,
    anomalies,
    riskScore: calculateEngagementRiskScore(metrics, baselineMetrics)
  };
};

const calculateEngagementVelocity = (post) => {
  const now = Date.now();
  const postAge = now - new Date(post.createdAt).getTime();
  const totalEngagement = post.likes.length + post.comments.length + post.shares;
  
  return totalEngagement / (postAge / 1000 / 60); // Engagement per minute
};

const calculateEngagementRiskScore = (metrics, baseline) => {
  let score = 0;
  
  // Likes anomaly
  if (metrics.likes > baseline.avgLikes * 3) {
    score += 30;
  }
  
  // Comments anomaly
  if (metrics.comments > baseline.avgComments * 4) {
    score += 25;
  }
  
  // Shares anomaly
  if (metrics.shares > baseline.avgShares * 5) {
    score += 20;
  }
  
  // Velocity anomaly
  if (metrics.velocity > baseline.avgVelocity * 2) {
    score += 25;
  }
  
  return Math.min(score, 100);
};