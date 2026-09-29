import React, { useState } from 'react';
import '../styles/components/PostCard.css';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Eye,
  Flag,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import PostActions from './PostActions';
import AIContentBadge from './AIContentBadge';
import SponsoredBadge from './SponsoredBadge';
import SafetyBadge from './SafetyBadge';
import WhySeeingThis from './WhySeeingThis';

const PostCard = ({ post, onPostUpdated }) => {
  const { auth } = useAuth();
  const [currentPost, setCurrentPost] = useState(post);
  const [showActions, setShowActions] = useState(false);
  const [showWhySeeingThis, setShowWhySeeingThis] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const updatePost = (updatedPost) => {
    setCurrentPost(previousPost => ({ ...previousPost, ...updatedPost }));
    onPostUpdated?.(updatedPost);
  };

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath || mediaPath === 'default.jpg') return '';
    if (mediaPath.startsWith('http')) return mediaPath;
    return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${mediaPath}`;
  };
  
  const handleLike = async () => {
    if (!auth.token || busy) return toast.error('Please log in to like posts');
    setBusy(true);
    try {
      const response = await api.post(`/posts/${currentPost._id}/like`);
      updatePost(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update like');
    } finally {
      setBusy(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    if (!auth.token) return toast.error('Please log in to comment');
    setBusy(true);
    try {
      const response = await api.post(`/posts/${currentPost._id}/comment`, { text: commentText.trim() });
      updatePost(response.data.data);
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add comment');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (!auth.token || busy) return toast.error('Please log in to share posts');
    setBusy(true);
    try {
      const response = await api.post(`/posts/${currentPost._id}/share`);
      updatePost(response.data.data);
      await navigator.clipboard?.writeText(`${window.location.origin}/post/${currentPost._id}`);
      toast.success('Post shared and link copied');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not share post');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!auth.token || busy) return toast.error('Please log in to save posts');
    setBusy(true);
    try {
      const response = await api.post(`/posts/${currentPost._id}/save`);
      setSaved(response.data.saved);
      toast.success(response.data.saved ? 'Post saved' : 'Post removed from saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save post');
    } finally {
      setBusy(false);
    }
  };

  const handleReport = () => {
    toast('Use the post menu to report this post');
  };

  const getFactStatusIcon = (postData) => {
    switch (postData.factStatus) {
      case 'Supported':
        return <CheckCircle className="fact-status-icon supported" size={16} />;
      case 'Disputed':
        return <XCircle className="fact-status-icon disputed" size={16} />;
      case 'Under Review':
        return <AlertCircle className="fact-status-icon review" size={16} />;
      default:
        return null;
    }
  };

  const getFactStatusText = (postData) => {
    switch (postData.factStatus) {
      case 'Supported':
        return 'Verified';
      case 'Disputed':
        return 'Disputed';
      case 'Under Review':
        return 'Under Review';
      default:
        return '';
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
            <Link to={`/profile/${currentPost.author._id}`} className="author-avatar">
            <img 
              src={currentPost.author.profileImage || `https://ui-avatars.com/api/?name=${currentPost.author.name}&background=087f75&color=fff`} 
              alt={currentPost.author.name} 
            />
          </Link>
          <div className="author-info">
            <Link to={`/profile/${currentPost.author._id}`} className="author-name">
              {currentPost.author.name}
            </Link>
            <div className="post-meta">
              <span>{formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span>{currentPost.interest}</span>
            </div>
          </div>
        </div>
        
        <div className="post-options">
          <button 
            className="more-options"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreHorizontal size={20} />
          </button>
          
          {showActions && (
            <PostActions 
              post={currentPost} 
              onReport={handleReport}
              onClose={() => setShowActions(false)}
            />
          )}
        </div>
      </div>
      
      <div className="post-content">
        <p className="post-text">{currentPost.content}</p>
        
        {getMediaUrl(currentPost.image) && (
          <div className="post-image">
            <img src={getMediaUrl(currentPost.image)} alt="Post attachment" />
          </div>
        )}
        
        {getMediaUrl(currentPost.video) && (
          <div className="post-video">
            <video controls>
              <source src={getMediaUrl(currentPost.video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      
      <div className="post-badges">
        <AIContentBadge type={currentPost.aiLabel} />
        {currentPost.sponsored && <SponsoredBadge />}
        <SafetyBadge status={currentPost.moderationStatus} />
        {getFactStatusIcon(currentPost) && (
          <div className="fact-status-badge">
            {getFactStatusIcon(currentPost)}
            <span>{getFactStatusText(currentPost)}</span>
          </div>
        )}
      </div>
      
      <div className="post-stats">
        <div className="stat-item">
          <Eye size={16} />
          <span>{currentPost.likes.length} likes</span>
        </div>
        <div className="stat-item">
          <MessageCircle size={16} />
          <span>{currentPost.comments.length} comments</span>
        </div>
        <div className="stat-item">
          <Share2 size={16} />
          <span>{currentPost.shares} shares</span>
        </div>
      </div>
      
      <div className="post-actions">
        <button className={`action-btn like-btn ${currentPost.likes.some(like => like.toString() === auth.user?.id) ? 'active' : ''}`} onClick={handleLike} disabled={busy}>
          <Heart size={20} fill="currentColor" />
          <span>Like</span>
        </button>
        <button className="action-btn comment-btn" onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>
        <button className="action-btn share-btn" onClick={handleShare} disabled={busy}>
          <Share2 size={20} />
          <span>Share</span>
        </button>
        <button className={`action-btn save-btn ${saved ? 'active' : ''}`} onClick={handleSave} disabled={busy}>
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-panel">
          <div className="comments-list">
            {currentPost.comments.map((comment, index) => (
              <div className="comment" key={comment._id || index}>
                <strong>{comment.user?.name || 'Community member'}</strong>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
          <form className="comment-form" onSubmit={handleComment}>
            <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Write a comment..." maxLength={500} />
            <button className="btn btn-primary" type="submit" disabled={busy || !commentText.trim()}>Send</button>
          </form>
        </div>
      )}
      
      <div className="post-footer">
        <button 
          className="why-seeing-this"
          onClick={() => setShowWhySeeingThis(true)}
        >
          <Eye size={16} />
          <span>Why am I seeing this?</span>
        </button>
      </div>
      
      {showWhySeeingThis && (
        <WhySeeingThis 
          post={currentPost} 
          onClose={() => setShowWhySeeingThis(false)}
        />
      )}
    </div>
  );
};

export default PostCard;