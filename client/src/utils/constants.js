export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  USERS: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    PRIVACY: '/users/privacy',
    SAFETY: '/users/safety',
    BLOCK: '/users/:id/block',
    UNBLOCK: '/users/:id/unblock',
    REPORT: '/users/:id/report',
    APPEAL: '/users/:id/appeal'
  },
  POSTS: {
    LIST: '/posts',
    DETAIL: '/posts/:id',
    CREATE: '/posts',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
    LIKE: '/posts/:id/like',
    UNLIKE: '/posts/:id/like',
    REPORT: '/posts/:id/report',
    APPEAL: '/posts/:id/appeal'
  },
  COMMUNITIES: {
    LIST: '/communities',
    DETAIL: '/communities/:id',
    CREATE: '/communities',
    JOIN: '/communities/:id/join',
    LEAVE: '/communities/:id/leave',
    UPDATE: '/communities/:id',
    DELETE: '/communities/:id',
    POSTS: '/communities/:id/posts'
  },
  COLLABORATIONS: {
    LIST: '/collaborations',
    DETAIL: '/collaborations/:id',
    CREATE: '/collaborations',
    JOIN: '/collaborations/:id/join',
    LEAVE: '/collaborations/:id/leave',
    UPDATE: '/collaborations/:id',
    DELETE: '/collaborations/:id',
    CONTRIBUTE: '/collaborations/:id/contribute',
    GENERATE_VIDEO: '/collaborations/:id/generate-video',
    PUBLISH: '/collaborations/:id/publish'
  },
  CONTRIBUTIONS: {
    LIST: '/contributions',
    DETAIL: '/contributions/:id',
    CREATE: '/contributions',
    UPDATE: '/contributions/:id',
    DELETE: '/contributions/:id'
  },
  REPORTS: {
    LIST: '/reports',
    MY_REPORTS: '/reports/my',
    DETAIL: '/reports/:id',
    CREATE: '/reports',
    UPDATE: '/reports/:id',
    DELETE: '/reports/:id',
    RESOLVE: '/reports/:id/resolve',
    REJECT: '/reports/:id/reject',
    MARK_AS_READ: '/reports/:id/read',
    MARK_ALL_AS_READ: '/reports/mark-all-read'
  },
  APPEALS: {
    LIST: '/appeals',
    MY_APPEALS: '/appeals/my',
    DETAIL: '/appeals/:id',
    CREATE: '/appeals',
    UPDATE: '/appeals/:id',
    DELETE: '/appeals/:id',
    RESOLVE: '/appeals/:id/resolve',
    REJECT: '/appeals/:id/reject'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MY_NOTIFICATIONS: '/notifications/my',
    DETAIL: '/notifications/:id',
    MARK_AS_READ: '/notifications/:id/read',
    MARK_ALL_AS_READ: '/notifications/mark-all-read'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:id',
    POSTS: '/admin/posts',
    POST_DETAIL: '/admin/posts/:id',
    REPORTS: '/admin/reports',
    REPORT_DETAIL: '/admin/reports/:id',
    MODERATION: '/admin/moderation',
    MODERATION_DETAIL: '/admin/moderation/:id',
    FAKE_ACCOUNTS: '/admin/fake-accounts',
    FAKE_ACCOUNT_DETAIL: '/admin/fake-accounts/:id',
    ENGAGEMENT: '/admin/engagement',
    COLLABORATIONS: '/admin/collaborations',
    COLLABORATION_DETAIL: '/admin/collaborations/:id',
    APPEALS: '/admin/appeals',
    APPEAL_DETAIL: '/admin/appeals/:id',
    SAFETY: '/admin/safety'
  }
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video'
};

export const MODERATION_STATUSES = {
  SAFE: 'SAFE',
  REVIEW: 'REVIEW',
  RESTRICTED: 'RESTRICTED'
};

export const AI_LABELS = {
  HUMAN_CREATED: 'Human Created',
  AI_ASSISTED: 'AI Assisted',
  AI_GENERATED: 'AI Generated',
  AI_ORIGIN_UNCERTAIN: 'AI Origin Uncertain'
};

export const REPORT_REASONS = {
  HARASSMENT: 'Harassment',
  SPAM: 'Spam',
  FALSE_INFORMATION: 'False Information',
  FAKE_ACCOUNT: 'Fake Account',
  AI_MANIPULATION: 'AI Manipulation',
  HARMFUL_CONTENT: 'Harmful Content',
  HIDDEN_ADVERTISEMENT: 'Hidden Advertisement',
  OTHER: 'Other'
};

export const APPEAL_DECISIONS = {
  CONTENT_RESTRICTED: 'Content Restricted',
  ACCOUNT_SUSPENDED: 'Account Suspended',
  POST_REMOVED: 'Post Removed'
};

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const USER_STATUSES = {
  ACTIVE: 'active',
  BANNED: 'banned',
  SUSPENDED: 'suspended'
};

export const COLLABORATION_STATUSES = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const CONTRIBUTION_STATUSES = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const NOTIFICATION_TYPES = {
  REPORT_DECISION: 'Report Decision',
  APPEAL_DECISION: 'Appeal Decision',
  COLLABORATION_INVITATION: 'Collaboration Invitation',
  CONTRIBUTION_APPROVED: 'Contribution Approved',
  CONTRIBUTION_REJECTED: 'Contribution Rejected',
  COLLABORATION_PUBLISHED: 'Collaboration Published',
  COMMUNITY_ACTIVITY: 'Community Activity'
};