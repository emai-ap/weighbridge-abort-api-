import { useState } from "react";
import "./App.css";
import GatePortals from "./GatePortals";

function App() {
  let max = new Date().toISOString().split("T")[0];
  const [Daily, setDaily] = useState(max);
  let gate_users = ["dfc", "main"];
  const [gate, setGate] = useState(gate_users[0]);
  return (
    <>
      <div className="flex">
        {gate_users.map((item) => (
          <div
            onClick={() => {
              setGate(item);
            }}
            className={item === gate ? "gateusercard b" : "gateusercard"}
          >
            {item}
          </div>
        ))}

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
      </div>
      <GatePortals {...{ Daily, gate }} />
    </>
  );
}

export default App;
