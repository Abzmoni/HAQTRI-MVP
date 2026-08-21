import React, { useState } from "react";
import API from "../../utils/api";
import "./CreateStreamModal.css";

const CreateStreamModal = ({ onClose, onStreamCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Real Estate",
    tags: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/live", formData);
      onStreamCreated(res.data);
    } catch (err) {
      console.error("Error creating stream:", err);
      alert("Error creating stream. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h3>Create Live Stream</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Stream Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Luxury Villa Tour in Lagos"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe what you'll be streaming about..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Real Estate">Real Estate</option>
              <option value="Construction">Construction</option>
              <option value="Home Improvement">Home Improvement</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Architecture">Architecture</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., luxury, villa, lagos, tour"
            />
          </div>

          <div className="stream-instructions">
            <h4>How to stream:</h4>
            <ol>
              <li>Click "Create Stream" to generate your stream key</li>
              <li>Use streaming software like OBS with these settings:
                <ul>
                  <li>Server: <code>rtmp://haqtri.live</code></li>
                  <li>Stream Key: <em>Will be provided after creation</em></li>
                </ul>
              </li>
              <li>Click "Start Streaming" in your software</li>
              <li>Return here and click "Go Live"</li>
            </ol>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Stream"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStreamModal;