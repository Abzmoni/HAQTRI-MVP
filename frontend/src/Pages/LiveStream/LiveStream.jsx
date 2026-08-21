import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import StreamCard from "./StreamCard";
import CreateStreamModal from "./CreateStreamModal";
import "./LiveStream.css";

const LiveStream = () => {
  const [streams, setStreams] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [categories, setCategories] = useState(["All", "Real Estate", "Construction", "Home Improvement", "Interior Design"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredStreams(streams);
    } else {
      setFilteredStreams(streams.filter(stream => stream.category === selectedCategory));
    }
  }, [selectedCategory, streams]);

  const fetchStreams = async () => {
    try {
      const res = await API.get("/live");
      setStreams(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching streams:", err);
      setLoading(false);
    }
  };

  const handleCreateStream = () => {
    setShowCreateModal(true);
  };

  const handleStreamCreated = (newStream) => {
    setStreams([newStream, ...streams]);
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="live-stream-page">
        <div className="loading-spinner">Loading streams...</div>
      </div>
    );
  }

  return (
    <div className="live-stream-page">
      <div className="vintage-corner corner-tl"></div>
      <div className="vintage-corner corner-tr"></div>

      <div className="container">
        {/* Add this section header back */}
        <div className="section-header">
          <h2 className="section-title">Live Streams</h2>
          <p className="section-subtitle">
            Watch live property tours, construction projects, and home improvement tutorials
          </p>
        </div>

        <div className="ornamental-divider">
          <div className="divider-line"></div>
          <div className="divider-icon"><i className="fas fa-circle"></i></div>
          <div className="divider-line"></div>
        </div>

        <div className="stream-controls">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`tab-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleCreateStream}>
            <i className="fas fa-video"></i> Go Live
          </button>
        </div>

        {filteredStreams.length === 0 ? (
          <div className="no-streams">
            <i className="fas fa-video-slash"></i>
            <h3>No live streams available</h3>
            <p>Be the first to start a live stream in the {selectedCategory !== "All" ? selectedCategory : ""} category</p>
            <button className="btn btn-primary" onClick={handleCreateStream}>
              Start Streaming
            </button>
          </div>
        ) : (
          <div className="streams-grid">
            {filteredStreams.map(stream => (
              <StreamCard key={stream._id} stream={stream} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateStreamModal 
          onClose={() => setShowCreateModal(false)}
          onStreamCreated={handleStreamCreated}
        />
      )}

      <div className="vintage-corner corner-bl"></div>
      <div className="vintage-corner corner-br"></div>
    </div>
  );
};

export default LiveStream;