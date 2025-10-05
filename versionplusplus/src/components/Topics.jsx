// src/components/Topics.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [groups, setGroups] = useState([]);
  const [qnas, setQnas] = useState([]);
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [approxTime, setApproxTime] = useState("");
  const [groupId, setGroupId] = useState("");
  const [selectedQnA, setSelectedQnA] = useState([]); // array of qna ids
  const [suggestedBy, setSuggestedBy] = useState("");

  useEffect(() => {
    api.get("/api/core/topics/").then((r) => setTopics(r.data)).catch(()=>{});
    api.get("/api/core/groups/").then((r) => setGroups(r.data)).catch(()=>{});
    api.get("/api/core/qna/").then((r) => setQnas(r.data)).catch(()=>{});
    api.get("/api/user/users/").then((r) => setUsers(r.data)).catch(()=>{});
  }, []);

  const handleQnASelect = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedQnA(options.map(o => o.value));
  };

  const addTopic = async () => {
    if (!name || !description) return alert("Name & description required");
    try {
      const payload = {
        name,
        description,
        approx_time: approxTime ? parseFloat(approxTime) : 0,
        group: groupId || null,
        qna: selectedQnA,
        suggested_by: suggestedBy || null,
      };
      const res = await api.post("/api/core/topics/", payload);
      setTopics((s) => [...s, res.data]);
      setName(""); setDescription(""); setApproxTime(""); setGroupId(""); setSelectedQnA([]); setSuggestedBy("");
    } catch (e) {
      console.error(e);
      alert("Failed to create Topic");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Topics</h2>

      <div>
        <input placeholder="Topic name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Approx time (hours)" value={approxTime} onChange={(e) => setApproxTime(e.target.value)} />

        <div>
          <label>Group: </label>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">-- none --</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div>
          <label>QnA (multi-select): </label>
          <select multiple size={5} value={selectedQnA} onChange={handleQnASelect}>
            {qnas.map(q => <option key={q.id} value={q.id}>{q.question}</option>)}
          </select>
        </div>

        <div>
          <label>Suggested by (user): </label>
          <select value={suggestedBy} onChange={(e) => setSuggestedBy(e.target.value)}>
            <option value="">-- none --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username || u.email}</option>)}
          </select>
        </div>

        <button onClick={addTopic}>Add Topic</button>
      </div>

      <ul>
        {topics.map(t => (
          <li key={t.id}>
            <b>{t.name}</b> ({t.approx_time}h) — {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
