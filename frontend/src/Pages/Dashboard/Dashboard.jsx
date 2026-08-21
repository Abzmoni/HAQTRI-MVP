// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import Feed from "../../components/Dashboard/Feed/Feed";
import Status from "../../components/Dashboard/Status/Status";
import AddPost from "../../components/Dashboard/AddPost/AddPost";

export default function Dashboard() {
  const [refreshFeed, setRefreshFeed] = useState(false);

  const handlePostAdded = () => {
    // trigger Feed to refresh after new post
    setRefreshFeed((prev) => !prev);
  };

  return (
    <div className="dashboard-page">
      {/* Vintage Background Elements */}
      <div className="vintage-bg">
        <div className="vintage-pattern"></div>
        <div className="paper-texture"></div>
        <div className="vintage-elements">
          <div className="vintage-divider"></div>
          <div className="vintage-divider"></div>
          <div className="vintage-divider"></div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="dashboard-container">
          {/* Status / Stories */}
          <section className="dashboard-section">
            <Status />
          </section>

          {/* Add Post */}
          <section className="dashboard-section">
            <AddPost onPostAdded={handlePostAdded} />
          </section>

          {/* Feed */}
          <section className="dashboard-section">
            <Feed refresh={refreshFeed} />
          </section>
        </div>
      </div>
    </div>
  );
}