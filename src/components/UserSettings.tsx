// src/components/UserSettings.tsx
'use client';

import React, { useState } from "react";

const UserSettings: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
    alert("Settings saved!");
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>User Settings</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Enable notifications
          </label>
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default UserSettings;
