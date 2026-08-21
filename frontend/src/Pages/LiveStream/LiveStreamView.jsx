import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/api";
import "./LiveStreamView.css";

const LiveStreamView = () => {
  const { id } = useParams();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStream();
  }, [id]);

  const fetchStream = async () => {
    try {
      const res = await API.get(`/live/${id}`);
      setStream(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stream:", err);
      setError("Failed to load stream");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="live-stream-view">
        <div className="loading-spinner">Loading stream...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-stream-view">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="live-stream-view">
        <div className="error-message">Stream not found</div>
      </div>
    );
  }

  return (
    <div className="live-stream-view">
      <div className="vintage-corner corner-tl"></div>
      <div className="vintage-corner corner-tr"></div>

      <div className="container">
        <div className="stream-header">
          <h1 className="stream-title">{stream.title}</h1>
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
            
            <div className="stream-stats">
              <span className="viewer-count">
                <i className="fas fa-users"></i> {stream.viewerCount} viewers
              </span>
              <span className="stream-category">{stream.category}</span>
            </div>
          </div>
        </div>

        <div className="stream-player">
          <div className="player-placeholder">
            <i className="fas fa-video"></i>
            <h3>Live Stream Player</h3>
            <p>Stream Key: {stream.streamKey}</p>
            <p>RTMP URL: {stream.rtmpUrl}</p>
            <div className="player-actions">
              {stream.isLive ? (
                <button className="btn btn-primary">
                  <i className="fas fa-play"></i> Watch Live
                </button>
              ) : (
                <button className="btn btn-outline" disabled>
                  Stream Offline
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="stream-chat">
          <h3>Live Chat</h3>
          <div className="chat-placeholder">
            <i className="fas fa-comments"></i>
            <p>Chat functionality will be implemented here</p>
          </div>
        </div>
      </div>

      <div className="vintage-corner corner-bl"></div>
      <div className="vintage-corner corner-br"></div>
    </div>
  );
};

export default LiveStreamView;