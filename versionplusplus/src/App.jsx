import React from "react";
import Groups from "./components/Groups";
import QnA from "./components/QnA";
import Topics from "./components/Topics";
import Candidates from "./components/Candidates";
import Records from "./components/Records";
import Users from "./components/Users";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Version++</h1>
      <Groups />
      <QnA />
      <Topics />
      <Candidates />
      <Records />
      <Users />
    </div>
  );
}
