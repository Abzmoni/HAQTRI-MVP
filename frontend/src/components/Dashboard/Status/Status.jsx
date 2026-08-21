// Status.jsx
import React, { useEffect, useState } from "react";
import API from "../../../utils/api";
import "./Status.css";

export default function Status() {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/status");
      setStatuses(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching statuses:", err);
      setError("Failed to load statuses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    if (caption) formData.append("caption", caption);

    try {
      setLoading(true);
      await API.post("/status", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      setCaption("");
      setShowUploadForm(false);
      setError("");
      
      // Refresh statuses after successful upload
      fetchStatuses();
    } catch (err) {
      console.error("Error uploading story:", err);
      setError("Failed to upload status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextItem = () => {
    if (selectedStatus && selectedStatus.items) {
      setCurrentItemIndex(prev => 
        prev < selectedStatus.items.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handlePrevItem = () => {
    if (selectedStatus && selectedStatus.items) {
      setCurrentItemIndex(prev => 
        prev > 0 ? prev - 1 : selectedStatus.items.length - 1
      );
    }
  };

  return (
    <div className="status-container">

      <div className="status-scroll">
        {/* Add Story */}
        <div className="status-item add-story">
          <div 
            className="status-circle add-circle" 
            onClick={() => setShowUploadForm(true)}
          >
            <i className="fas fa-plus"></i>
          </div>
          <span>Your Story</span>
        </div>

        {/* Status List */}
        {loading ? (
          <div className="status-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="status-error">{error}</div>
        ) : !Array.isArray(statuses) || statuses.length === 0 ? (
          <>
            {/* Placeholder status bubbles */}
            {[1, 2, 3].map(i => (
              <div key={i} className="status-item placeholder">
                <div className="status-circle">
                  <i className="fas fa-user"></i>
                </div>
                <span>Friend {i}</span>
              </div>
            ))}
          </>
        ) : (
          statuses.map(status => {
            let previewSrc = "/default-avatar.png";
            if (status.items && status.items.length > 0) {
              const lastItem = status.items[status.items.length - 1];
              previewSrc = `http://localhost:4000${lastItem.mediaUrl}`;
            } else if (status.user?.profilePic) {
              previewSrc = `http://localhost:4000${status.user.profilePic}`;
            }

            return (
              <div
                key={status._id}
                className="status-item"
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentItemIndex(0);
                }}
              >
                <div className="status-circle">
                  <img src={previewSrc} alt="status" />
                  {status.isLive && <span className="live-badge">LIVE</span>}
                </div>
                <span>{status.user?.name || "Unknown"}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <div className="modal-header">
              <h3>Add to Your Story</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowUploadForm(false);
                  setError("");
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddStory} className="status-form">
              <div className="file-input-container">
                <label htmlFor="status-file" className="file-input-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{file ? file.name : "Choose file"}</span>
                </label>
                <input
                  id="status-file"
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Add a caption (optional)..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="caption-input"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Add to Story"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Viewer */}
      {selectedStatus && (
        <div className="status-viewer-overlay">
          <div className="status-viewer">
            <div className="viewer-header">
              <div className="viewer-user">
                <div className="user-avatar">
                  <img 
                    src={selectedStatus.user?.profilePic 
                      ? `http://localhost:4000${selectedStatus.user.profilePic}` 
                      : "/default-avatar.png"
                    } 
                    alt={selectedStatus.user?.name} 
                  />
                </div>
                <div className="user-info">
                  <div className="user-name">{selectedStatus.user?.name}</div>
                  <div className="status-time">
                    {new Date(selectedStatus.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <button
                className="viewer-close"
                onClick={() => setSelectedStatus(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="status-content">
              {selectedStatus.items && selectedStatus.items.length > 0 && (
                <>
                  {selectedStatus.items[currentItemIndex].mediaType === "image" && (
                    <img 
                      src={`http://localhost:4000${selectedStatus.items[currentItemIndex].mediaUrl}`} 
                      alt="status" 
                    />
                  )}
                  {selectedStatus.items[currentItemIndex].mediaType === "video" && (
                    <video 
                      controls 
                      autoPlay
                      src={`http://localhost:4000${selectedStatus.items[currentItemIndex].mediaUrl}`} 
                    />
                  )}
                  {selectedStatus.items[currentItemIndex].mediaType === "audio" && (
                    <div className="audio-player">
                      <i className="fas fa-music"></i>
                      <audio 
                        controls 
                        autoPlay
                        src={`http://localhost:4000${selectedStatus.items[currentItemIndex].mediaUrl}`} 
                      />
                    </div>
                  )}
                  
                  {selectedStatus.items.length > 1 && (
                    <>
                      <button 
                        className="nav-button prev-button"
                        onClick={handlePrevItem}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button 
                        className="nav-button next-button"
                        onClick={handleNextItem}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      <div className="status-indicator">
                        {selectedStatus.items.map((_, index) => (
                          <div 
                            key={index} 
                            className={`indicator-dot ${index === currentItemIndex ? 'active' : ''}`}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {selectedStatus.items[currentItemIndex].caption && (
                    <div className="status-caption">
                      {selectedStatus.items[currentItemIndex].caption}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}