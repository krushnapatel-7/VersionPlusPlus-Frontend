// src/components/QnA.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function QnA() {
  const [qnas, setQnas] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.get("/api/core/qna/")
      .then((res) => { if (mounted) setQnas(res.data); })
      .catch((e) => setError("Failed to load QnA"))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const addQnA = async () => {
    if (!question || !answer) return alert("Enter question and answer");
    try {
      const res = await api.post("/api/core/qna/", { question, answer });
      setQnas((s) => [...s, res.data]);
      setQuestion("");
      setAnswer("");
    } catch (e) {
      console.error(e);
      alert("Failed to create QnA");
    }
  };

  if (loading) return <div><h2>QnA</h2><p>Loading...</p></div>;
  if (error) return <div><h2>QnA</h2><p style={{color:"red"}}>{error}</p></div>;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>QnA</h2>
      <div>
        <input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button onClick={addQnA}>Add</button>
      </div>
      <ul>
        {qnas.map((q) => <li key={q.id}><b>{q.question}</b> — {q.answer}</li>)}
      </ul>
    </div>
  );
}
