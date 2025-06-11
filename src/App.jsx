import { useState } from "react";
import "./App.css";
import GatePortals from "./GatePortals";

function App() {
  let max = new Date().toISOString().split("T")[0];
  const [Daily, setDaily] = useState(max);

  return (
    <>
      <div
        style={{
          height: "30vh",
        }}
      >
        <input
          type="date"
          value={Daily}
          onChange={(e) => setDaily(e.target.value)}
          max={max}
        />
      </div>
      <GatePortals Daily={Daily} />
    </>
  );
}

export default App;
