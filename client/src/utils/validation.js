import { USER_ROLES, CONTENT_TYPES, MODERATION_STATUSES, AI_LABELS } from './constants';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validateName = (name) => {
  // 2-50 characters, letters and spaces
  const re = /^[a-zA-Z\s]{2,50}$/;
  return re.test(name);
};

export const validateBio = (bio) => {
  // Max 200 characters
  return bio.length <= 200;
};

export const validateInterest = (interest) => {
  // Should be in the predefined list
  const validInterests = ['Technology', 'Science', 'Education', 'Sports', 'Art', 'Entertainment', 'Personal Stories', 'Social Causes'];
  return validInterests.includes(interest);
};

export const validateFocusMode = (focusMode) => {
  // Should be in the predefined list
  const validModes = ['Technology', 'Science', 'Sports', 'Art', 'Education', 'Entertainment', 'Personal Stories', 'Social Causes', 'Explore'];
  return validModes.includes(focusMode);
};

export const validateDiscoveryLevel = (discoveryLevel) => {
  // Should be in the predefined list
  const validLevels = ['Focus Only', 'Mostly My Interests', 'Balanced', 'Explore More'];
  return validLevels.includes(discoveryLevel);
};

export const validatePrivacySettings = (settings) => {
  const errors = {};
  
  if (!settings.profileVisibility || !['Public', 'Community', 'Private'].includes(settings.profileVisibility)) {
    errors.profileVisibility = 'Invalid profile visibility setting';
  }
  
  if (!settings.messaging || !['Everyone', 'Followers', 'Nobody'].includes(settings.messaging)) {
    errors.messaging = 'Invalid messaging setting';
  }
  
  if (typeof settings.onlineStatus !== 'boolean') {
    errors.onlineStatus = 'Online status must be a boolean';
  }
  
  if (typeof settings.contentReuse !== 'boolean') {
    errors.contentReuse = 'Content reuse permission must be a boolean';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSafetySettings = (settings) => {
  const errors = {};
  
  if (!settings.contentFiltering || !['Low', 'Medium', 'High'].includes(settings.contentFiltering)) {
    errors.contentFiltering = 'Invalid content filtering level';
  }
  
  if (typeof settings.teenProtection !== 'boolean') {
    errors.teenProtection = 'Teen protection must be a boolean';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePostContent = (content) => {
  const errors = {};
  
  if (!content || content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (content.length > 2000) {
    errors.content = 'Content must be less than 2000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateReportData = (reportData) => {
  const errors = {};
  
  if (!reportData.reason || !Object.values(REPORT_REASONS).includes(reportData.reason)) {
    errors.reason = 'Invalid report reason';
  }
  
  if (reportData.description && reportData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAppealData = (appealData) => {
  const errors = {};
  
  if (!appealData.decision || !Object.values(APPEAL_DECISIONS).includes(appealData.decision)) {
    errors.decision = 'Invalid appeal decision';
  }
  
  if (!appealData.reason || appealData.reason.trim().length === 0) {
    errors.reason = 'Reason is required';
  } else if (appealData.reason.length > 1000) {
    errors.reason = 'Reason must be less than 1000 characters';
  }
  
  if (appealData.description && appealData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCommunityData = (communityData) => {
  const errors = {};
  
  if (!communityData.name || communityData.name.trim().length === 0) {
    errors.name = 'Community name is required';
  } else if (communityData.name.length > 50) {
    errors.name = 'Community name must be less than 50 characters';
  }
  
  if (!communityData.description || communityData.description.trim().length === 0) {
    errors.description = 'Community description is required';
  } else if (communityData.description.length > 500) {
    errors.description = 'Community description must be less than 500 characters';
  }
  
  if (!communityData.interest || !validateInterest(communityData.interest)) {
    errors.interest = 'Invalid community interest';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCollaborationData = (collaborationData) => {
  const errors = {};
  
  if (!collaborationData.title || collaborationData.title.trim().length === 0) {
    errors.title = 'Collaboration title is required';
  } else if (collaborationData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (!collaborationData.description || collaborationData.description.trim().length === 0) {
    errors.description = 'Collaboration description is required';
  } else if (collaborationData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  if (!collaborationData.purpose || collaborationData.purpose.trim().length === 0) {
    errors.purpose = 'Collaboration purpose is required';
  } else if (collaborationData.purpose.length > 500) {
    errors.purpose = 'Purpose must be less than 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  // Basic XSS prevention
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const detectSpamContent = (content) => {
  // Basic spam detection
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'lottery', 'winner', 'free money',
    'click here', 'limited time', 'act now', 'urgent', 'congratulations'
  ];
  
  const lowerContent = content.toLowerCase();
  return spamKeywords.some(keyword => lowerContent.includes(keyword));
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};