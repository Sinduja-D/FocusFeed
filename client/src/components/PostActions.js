import React from 'react';
import '../styles/components/PostActions.css';
import { 
  Copy, 
  Share2, 
  Flag, 
  Ban,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

const PostActions = ({ post, onReport, onClose }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post._id}`);
    onClose();
  };

  const handleShare = () => {
    // Implementation for sharing
    onClose();
  };

  const handleReport = () => {
    onReport();
    onClose();
  };

  const handleBlock = () => {
    // Implementation for blocking user
    onClose();
  };

  const handleDelete = () => {
    // Implementation for deleting post
    onClose();
  };

  return (
    <div className="post-actions-menu">
      <div className="actions-header">
        <h3>Post Actions</h3>
        <button onClick={onClose}>
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="actions-list">
        <button onClick={handleCopyLink} className="action-item">
          <Copy size={16} />
          <span>Copy Link</span>
        </button>
        
        <button onClick={handleShare} className="action-item">
          <Share2 size={16} />
          <span>Share Post</span>
        </button>
        
        <button onClick={handleReport} className="action-item">
          <Flag size={16} />
          <span>Report Post</span>
        </button>
        
        <button onClick={handleBlock} className="action-item">
          <Ban size={16} />
          <span>Block User</span>
        </button>
        
        <button onClick={handleDelete} className="action-item delete">
          <Trash2 size={16} />
          <span>Delete Post</span>
        </button>
      </div>
    </div>
  );
};

export default PostActions;