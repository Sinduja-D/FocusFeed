// Calculate engagement score for a post
const scoreEngagement = (post) => {
  let score = 0;
  
  // Likes (0-30 points)
  score += Math.min(post.likes.length * 2, 30);
  
  // Comments (0-40 points)
  score += Math.min(post.comments.length * 4, 40);
  
  // Shares (0-20 points)
  score += Math.min(post.shares * 5, 20);
  
  // Velocity (0-10 points)
  const postAge = Date.now() - new Date(post.createdAt).getTime();
  const velocity = (post.likes.length + post.comments.length + post.shares) / (postAge / 1000 / 60); // per minute
  score += Math.min(velocity * 10, 10);
  
  return Math.round(score);
};

// Calculate risk score for a user
const calculateRiskScore = (user) => {
  let score = 0;
  
  // Account age penalty (newer accounts are riskier)
  const accountAge = Date.now() - new Date(user.createdAt).getTime();
  if (accountAge < 7 * 24 * 60 * 60 * 1000) { // Less than a week
    score += 30;
  } else if (accountAge < 30 * 24 * 60 * 60 * 1000) { // Less than a month
    score += 15;
  }
  
  // Profile completion penalty
  if (!user.profileImage) score += 10;
  if (!user.bio) score += 10;
  
  // Suspicious username patterns
  if (user.username && (
    user.username.includes('admin') ||
    user.username.includes('root') ||
    user.username.includes('bot') ||
    user.username.includes('spam')
  )) {
    score += 20;
  }
  
  // Email domain risk
  if (user.email) {
    const domain = user.email.split('@')[1];
    if (domain && (
      domain.includes('tempmail') ||
      domain.includes('10minutemail') ||
      domain.includes('guerrillamail')
    )) {
      score += 25;
    }
  }
  
  // Activity patterns
  const recentActivity = user.lastActive ? Date.now() - new Date(user.lastActive).getTime() : Infinity;
  if (recentActivity > 30 * 24 * 60 * 60 * 1000) { // Last activity more than a month ago
    score += 15;
  }
  
  // Previous violations
  if (user.previousViolations && user.previousViolations.length > 0) {
    score += user.previousViolations.length * 10;
  }
  
  // Bot-like behavior indicators
  if (user.botLikeBehavior) {
    score += user.botLikeBehavior.score;
  }
  
  return Math.min(score, 100); // Cap at 100
};

// Calculate content safety score
const calculateSafetyScore = (content) => {
  let score = 100; // Start with perfect score
  const lowerContent = content.toLowerCase();
  
  // Hate speech patterns
  const hateWords = ['hate', 'kill', 'die', 'stupid', 'idiot', 'moron', 'retard'];
  hateWords.forEach(word => {
    if (lowerContent.includes(word)) {
      score -= 10;
    }
  });
  
  // Harassment patterns
  const harassmentWords = ['bully', 'harass', 'threat', 'abuse', 'violence'];
  harassmentWords.forEach(word => {
    if (lowerContent.includes(word)) {
      score -= 15;
    }
  });
  
  // Spam patterns
  const spamPatterns = [
    /click here/gi,
    /limited time/gi,
    /act now/gi,
    /urgent/gi,
    /congratulations/gi,
    /winner/gi,
    /free money/gi,
    /casino/gi,
    /lottery/gi
  ];
  
  spamPatterns.forEach(pattern => {
    if (pattern.test(lowerContent)) {
      score -= 20;
    }
  });
  
  // Excessive capitalization
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5) {
    score -= 10;
  }
  
  // Excessive punctuation
  const punctRatio = (content.match(/[!?.]/g) || []).length / content.length;
  if (punctRatio > 0.2) {
    score -= 10;
  }
  
  // Suspicious links
  const linkPattern = /(https?:\/\/[^\s]+)/gi;
  if (linkPattern.test(content)) {
    score -= 15;
  }
  
  return Math.max(score, 0); // Ensure score doesn't go below 0
};

module.exports = {
  scoreEngagement,
  calculateRiskScore,
  calculateSafetyScore
};