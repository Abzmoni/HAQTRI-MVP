// src/Pages/Dashboard/Feed.jsx
import { useState, useEffect } from "react";
import "./Feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    caption: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      caption: form.caption,
      image: form.image ? URL.createObjectURL(form.image) : null,
      time: "Just now",
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setForm({ caption: "", image: null });
  };

  return (
    <div className="feed">
      {/* Create Post */}
      <form className="create-post" onSubmit={handleSubmit}>
        <textarea
          name="caption"
          placeholder="Share an update..."
          value={form.caption}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit">Post</button>
      </form>

      {/* Feed */}
      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <div className="post" key={p.id}>
              {p.image && <img src={p.image} alt="post" />}
              <p>{p.caption}</p>
              <span className="time">{p.time}</span>
              <div className="actions">
                ❤️ {p.likes} · 💬 Comment · 🔁 Share
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
