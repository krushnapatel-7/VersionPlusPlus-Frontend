// src/components/Groups.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/api/core/groups/").then((res) => setGroups(res.data));
  }, []);

  const handleAdd = async () => {
    if (!name) return alert("Enter a name");
    const res = await api.post("/api/core/groups/", { name });
    setGroups([...groups, res.data]);
    setName("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Groups</h2>
      <input
        className="border p-1 m-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New group name"
      />
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={handleAdd}
      >
        Add
      </button>
      <ul>
        {groups.map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
    </div>
  );
}
