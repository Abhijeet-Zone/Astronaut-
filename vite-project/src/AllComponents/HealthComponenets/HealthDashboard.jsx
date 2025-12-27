import React from "react";
import healthData from "./health.jsx";
import "./HealthData.css"
function HealthDashboard() {
  return (
    <div className="w-50px">
      <h2>🚀 Astronaut Health & Solutions</h2>
      <table className="w-screen">
        <thead>
          <tr>
            <th>Health Problem</th>
            
            <th>Health Solution</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {healthData.map((item, index) => (
            <tr key={index}>
              <td>{item.problem}</td>
              <td>{item.aiSolution}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default HealthDashboard;
// keep only the component's default export above