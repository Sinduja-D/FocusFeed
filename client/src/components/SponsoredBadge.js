import React from 'react';
import '../styles/components/SponsoredBadge.css';
import { DollarSign } from 'lucide-react';

const SponsoredBadge = () => {
  return (
    <div className="sponsored-badge">
      <DollarSign size={14} />
      <span>Sponsored</span>
    </div>
  );
};

export default SponsoredBadge;