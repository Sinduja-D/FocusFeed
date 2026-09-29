const User = require('../models/User');

class FakeAccountService {
  async detectFakeAccounts() {
    // In a real implementation, this would analyze user behavior patterns
    // For this demo, we'll implement a simple mock version
    
    const users = await User.find();
    const fakeAccounts = [];
    
    for (const user of users) {
      // Mock logic based on account age and activity
      const accountAgeInDays = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
      
      // Check for suspicious patterns
      let riskScore = 0;
      let riskReasons = [];
      
      // Very new account
      if (accountAgeInDays < 1) {
        riskScore += 30;
        riskReasons.push('Very new account');
      }
      
      // High posting frequency (in a real app, we'd check post count)
      // For demo, we'll simulate this
      if (accountAgeInDays < 7 && Math.random() > 0.7) {
        riskScore += 20;
        riskReasons.push('High posting frequency');
      }
      
      // Unusual activity (random for demo)
      if (Math.random() > 0.8) {
        riskScore += 25;
        riskReasons.push('Unusual activity pattern');
      }
      
      // Determine risk level
      let riskLevel = 'Normal';
      if (riskScore > 50) {
        riskLevel = 'High Risk';
      } else if (riskScore > 25) {
        riskLevel = 'Suspicious';
      }
      
      if (riskLevel !== 'Normal') {
        fakeAccounts.push({
          user,
          riskLevel,
          riskScore,
          riskReasons
        });
      }
    }
    
    return fakeAccounts;
  }
  
  async getUserRiskStatus(userId) {
    // In a real implementation, this would analyze the specific user's behavior
    // For this demo, we'll return a mock response
    
    const user = await User.findById(userId);
    
    // Mock logic
    const accountAgeInDays = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
    
    // Simple mock based on account age
    if (accountAgeInDays < 1) {
      return {
        status: 'High Risk',
        reasons: ['Very new account']
      };
    }
    
    if (accountAgeInDays < 7) {
      return {
        status: 'Suspicious',
        reasons: ['Recently created account']
      };
    }
    
    return {
      status: 'Normal',
      reasons: []
    };
  }
}

module.exports = new FakeAccountService();