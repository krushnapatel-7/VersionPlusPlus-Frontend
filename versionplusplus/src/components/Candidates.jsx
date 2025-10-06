// src/components/Candidates.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [topics, setTopics] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    api.get("/api/user/candidates/").then(r => setCandidates(r.data)).catch(()=>{});
    api.get("/api/core/topics/").then(r => setTopics(r.data)).catch(()=>{});
  }, []);

  const handleTopicSelect = (e) => {
    const opts = Array.from(e.target.selectedOptions);
    setSelectedTopics(opts.map(o => o.value));
  };

  const addCandidate = async () => {
    if (!name || !email) return alert("Name and email required");
    try {
      const payload = {
        name,
        email,
        phone_number: phone,
        topic: selectedTopics, // send array of topic ids
      };
      const res = await api.post("/api/user/candidates/", payload);
      setCandidates(s => [...s, res.data]);
      setName(""); setEmail(""); setPhone(""); setSelectedTopics([]);
    } catch (e) {
      console.error(e);
      alert("Failed to create candidate");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Candidates</h2>
      <div>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <div>
          <label>Topics (multi):</label>
          <select multiple size={6} value={selectedTopics} onChange={handleTopicSelect}>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <button onClick={addCandidate}>Add Candidate</button>
      </div>

      <ul>
        {candidates.map(c => (
          <li key={c.id}>
            {c.name} — {c.email} {c.phone_number ? `(${c.phone_number})` : ""}
            {c.topic && c.topic.length ? <div>Topics: {c.topic.join(", ")}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
