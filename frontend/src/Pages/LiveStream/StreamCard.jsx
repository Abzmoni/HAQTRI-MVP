import React from "react";
import { Link } from "react-router-dom";
import "./StreamCard.css";

const StreamCard = ({ stream }) => {
  return (
    <div className="stream-card">
      <Link to={`/live/${stream._id}`} className="stream-link">
        <div className="stream-thumbnail">
          <img 
            src={stream.thumbnail || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt={stream.title}
          />
          {stream.isLive && (
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </div>
          )}
          <div className="viewer-count">
            <i className="fas fa-users"></i> {stream.viewerCount}
          </div>
        </div>

        <div className="stream-info">
          <h3 className="stream-title">{stream.title}</h3>
          <p className="stream-description">{stream.description}</p>
          
          <div className="stream-meta">
            <div className="streamer-info">
              <img 
                src={stream.user.profilePic || "/default-avatar.png"} 
                alt={stream.user.name}
                className="streamer-avatar"
              />
              <span className="streamer-name">{stream.user.name}</span>
            </div>
            
            <div className="stream-category">
              {stream.category}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StreamCard;