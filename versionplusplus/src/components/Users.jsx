// src/components/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    api.get("/api/user/users/").then((r) => setUsers(r.data)).catch(()=>{});
  }, []);

  const addUser = async () => {
    if (!email || !username) return alert("Email and username required");
    try {
      const payload = { email, username, phone_number: phone };
      const res = await api.post("/api/user/users/", payload);
      setUsers(s => [...s, res.data]);
      setEmail(""); setUsername(""); setPhone("");
    } catch (e) {
      console.error(e);
      alert("Failed to create user");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Users</h2>
      <div>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <button onClick={addUser}>Add</button>
      </div>

      <ul>
        {users.map(u => <li key={u.id}>{u.username || u.email} ({u.email})</li>)}
      </ul>
    </div>
  );
}
