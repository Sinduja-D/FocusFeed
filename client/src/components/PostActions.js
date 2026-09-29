import React, { useState } from 'react';
import '../styles/components/PostActions.css';
import { Link } from 'react-router-dom';
import { 
  Copy, 
  Share2, 
  Flag, 
  Ban,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

const PostActions = ({ post, onReport, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post._id}`);
    setShowMenu(false);
    onClose();
  };

  const handleShare = () => {
    // Implementation for sharing
    setShowMenu(false);
    onClose();
  };

  const handleReport = () => {
    onReport();
    setShowMenu(false);
    onClose();
  };

  const handleBlock = () => {
    // Implementation for blocking user
    setShowMenu(false);
    onClose();
  };

  const handleDelete = () => {
    // Implementation for deleting post
    setShowMenu(false);
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