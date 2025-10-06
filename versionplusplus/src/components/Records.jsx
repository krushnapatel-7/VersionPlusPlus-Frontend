// src/components/Records.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [topics, setTopics] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [totalTime, setTotalTime] = useState("");

  useEffect(() => {
    api.get("/api/core/records/").then(r => setRecords(r.data)).catch(()=>{});
    api.get("/api/user/candidates/").then(r => setCandidates(r.data)).catch(()=>{});
    api.get("/api/core/topics/").then(r => setTopics(r.data)).catch(()=>{});
  }, []);

  const addRecord = async () => {
    if (!candidateId || !topicId || !totalTime) return alert("All fields required");
    try {
      const payload = { candidate: candidateId, topic: topicId, total_time: parseFloat(totalTime) };
      const res = await api.post("/api/core/records/", payload);
      setRecords(s => [...s, res.data]);
      setCandidateId(""); setTopicId(""); setTotalTime("");
    } catch (e) {
      console.error(e);
      alert("Failed to create record");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Records</h2>
      <div>
        <label>Candidate:</label>
        <select value={candidateId} onChange={(e)=>setCandidateId(e.target.value)}>
          <option value="">-- select candidate --</option>
          {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label>Topic:</label>
        <select value={topicId} onChange={(e)=>setTopicId(e.target.value)}>
          <option value="">-- select topic --</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <input type="number" placeholder="Total time (hours)" value={totalTime} onChange={(e)=>setTotalTime(e.target.value)} />
        <button onClick={addRecord}>Add Record</button>
      </div>

      <ul>
        {records.map(r => (
          <li key={r.id}>
            {r.candidate} - {r.topic} ({r.total_time}h) <br />
            <small>start: {r.start_time || "N/A"} end: {r.end_time || "N/A"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
