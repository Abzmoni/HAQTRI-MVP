// src/components/Dashboard/AddPost/AddPost.jsx (Compact version with clip icon)
import React, { useState, useRef } from "react";
import API from "../../../utils/api";
import "./AddPost.css";

export default function AddPost({ onPostAdded }) {
  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [musicFile, setMusicFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const handleMediaChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const handleMusicChange = (e) => {
    setMusicFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && mediaFiles.length === 0 && !musicFile) return;

    const formData = new FormData();
    formData.append("text", text);

    mediaFiles.forEach((file) => formData.append("media", file));
    if (musicFile) formData.append("media", musicFile);

    try {
      setLoading(true);
      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText("");
      setMediaFiles([]);
      setMusicFile(null);
      setIsExpanded(false);

      if (onPostAdded) onPostAdded(res.data);
    } catch (err) {
      console.error("Error adding post:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerMusicInput = () => {
    musicInputRef.current?.click();
  };

  return (
    <div className="add-post">
      {!isExpanded ? (
        <div 
          className="post-prompt"
          onClick={() => setIsExpanded(true)}
        >
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="prompt-text">What's on your mind?</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form compact">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            className="post-textarea"
            autoFocus
          />
          
          <div className="media-previews">
            {mediaFiles.map((file, idx) => (
              <div key={idx} className="media-preview">
                <i className="fas fa-file-image"></i>
                <span>{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== idx))}
                  className="remove-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            {musicFile && (
              <div className="media-preview">
                <i className="fas fa-file-audio"></i>
                <span>{musicFile.name}</span>
                <button 
                  type="button" 
                  onClick={() => setMusicFile(null)}
                  className="remove-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <div className="attachment-options">
              <button 
                type="button" 
                className="attachment-btn"
                onClick={triggerFileInput}
              >
                <i className="fas fa-paperclip"></i>
                <span>Media</span>
              </button>
              <button 
                type="button" 
                className="attachment-btn"
                onClick={triggerMusicInput}
              >
                <i className="fas fa-music"></i>
                <span>Audio</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden-input"
              />
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicChange}
                className="hidden-input"
              />
            </div>
            
            <div className="action-buttons">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setIsExpanded(false);
                  setMediaFiles([]);
                  setMusicFile(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || (!text && mediaFiles.length === 0 && !musicFile)}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}