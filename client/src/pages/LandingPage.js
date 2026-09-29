import React, { useState } from 'react';
import '../styles/pages/LandingPage.css';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Shield, 
  Eye,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, this would handle newsletter subscription
    setIsSubscribed(true);
    setEmail('');
  };

  const features = [
    {
      icon: Target,
      title: 'User-Controlled Feed',
      description: 'Choose what you see with customizable focus modes and discovery levels'
    },
    {
      icon: Eye,
      title: 'Explainable Recommendations',
      description: 'Understand why content appears in your feed with transparent reasoning'
    },
    {
      icon: Shield,
      title: 'Privacy & Safety',
      description: 'Comprehensive safety controls and privacy settings for peace of mind'
    },
    {
      icon: Users,
      title: 'Collaborative Creation',
      description: 'Work together with others to create amazing content and videos'
    }
  ];

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Social Media, <span>On Your Terms</span>
            </h1>
            <p className="hero-subtitle">
              Choose what matters. Control what you discover. Create responsibly.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/admin/login" className="landing-admin-link">
                Admin portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why FocusFeed?</h2>
          <p className="section-subtitle">
            Experience social media designed with your privacy and preferences in mind
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <CheckCircle className="value-icon" size={48} />
              <h3>User Control</h3>
              <p>You decide what you see, not an algorithm</p>
            </div>
            <div className="value-card">
              <CheckCircle className="value-icon" size={48} />
              <h3>Privacy First</h3>
              <p>Your data belongs to you, not us</p>
            </div>
            <div className="value-card">
              <CheckCircle className="value-icon" size={48} />
              <h3>Transparency</h3>
              <p>Know why content appears in your feed</p>
            </div>
            <div className="value-card">
              <CheckCircle className="value-icon" size={48} />
              <h3>Responsible AI</h3>
              <p>AI assists, but humans decide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to take control of your social media?</h2>
            <p>Join FocusFeed today and experience social media on your terms</p>
            <Link to="/register" className="btn btn-primary">
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get the latest news and updates about FocusFeed</p>
            
            {isSubscribed ? (
              <div className="success-message">
                <CheckCircle size={24} />
                <p>Thank you for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>FOCUSFEED</h3>
              <p>Social Media, On Your Terms</p>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/login">Sign in</Link></li>
                  <li><Link to="/register">Create account</Link></li>
                  <li><Link to="/admin/login">Admin portal</Link></li>
                </ul>
              </div>
              
              <div className="link-group">
                <h4>Company</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#values">Values</a></li>
                  <li><a href="#newsletter">Updates</a></li>
                </ul>
              </div>
              
              <div className="link-group">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#features">Privacy by design</a></li>
                  <li><a href="#values">Safety principles</a></li>
                  <li><Link to="/admin/login">Moderation</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2023 FocusFeed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;