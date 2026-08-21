// Feed.jsx
import React, { useEffect, useState } from "react";
import API from "../../../utils/api";
import { formatDistanceToNow } from 'date-fns';
import "./Feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? res.data : post
      ));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await API.post(`/posts/${postId}/comments`, { text });
      setPosts(posts.map(post => 
        post._id === postId ? res.data : post
      ));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">

      {posts.length === 0 ? (
        <div className="empty-feed">
          <i className="fas fa-feather"></i>
          <h3>No posts yet</h3>
          <p>Be the first to share your project or property!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onComment }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const submitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText("");
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user">
          <div className="user-avatar">
            {post.user?.name?.charAt(0) || "U"}
          </div>
          <div className="user-info">
            <div className="user-name">{post.user?.name || "Unknown User"}</div>
            <div className="post-time">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="post-actions">
          <button className="action-btn">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      {post.text && (
        <div className="post-content">
          <p>{post.text}</p>
        </div>
      )}

      {post.media && post.media.length > 0 && (
        <div className="post-media">
          {post.media.map((media, i) => (
            media.type === "image" ? (
              <img 
                key={i} 
                src={`http://localhost:4000${media.url}`} 
                alt="Post content" 
                className="media-item"
              />
            ) : (
              <video 
                key={i} 
                controls 
                src={`http://localhost:4000${media.url}`}
                className="media-item"
              />
            )
          ))}
        </div>
      )}

      {post.music && (
        <div className="post-music">
          <div className="music-player">
            <i className="fas fa-music"></i>
            <div className="music-info">
              <div className="music-title">{post.music.title}</div>
              <div className="music-artist">{post.music.artist}</div>
            </div>
            <audio controls src={post.music.url} />
          </div>
        </div>
      )}

      <div className="post-stats">
        <div className="stat-item">
          <i className="fas fa-heart"></i>
          <span>{post.likes?.length || 0} likes</span>
        </div>
        <div 
          className="stat-item clickable" 
          onClick={() => setShowComments(!showComments)}
        >
          <i className="fas fa-comment"></i>
          <span>{post.comments?.length || 0} comments</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-share"></i>
          <span>{post.shares?.length || 0} shares</span>
        </div>
      </div>

      <div className="post-actions-bar">
        <button 
          className={`action-button ${post.likes?.includes(localStorage.userId) ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          <i className="fas fa-heart"></i>
          <span>Like</span>
        </button>
        <button 
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="fas fa-comment"></i>
          <span>Comment</span>
        </button>
        <button className="action-button">
          <i className="fas fa-share"></i>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {post.comments?.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-avatar">
                {comment.user?.name?.charAt(0) || "U"}
              </div>
              <div className="comment-content">
                <div className="comment-author">{comment.user?.name || "Unknown User"}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-actions">
                  <span className="comment-time">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <form className="comment-form" onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}