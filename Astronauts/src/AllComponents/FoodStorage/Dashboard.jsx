import React, { useContext, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart
} from "recharts";
import { RealTimeDataContext } from './Realtimedata'; 

// Main Dashboard component
export default function Dashboard() {
  const { timeSeries, composition, radarData } = useContext(RealTimeDataContext);

  // Extract colors dynamically from composition
  const COLORS = useMemo(() => (composition?.map((c) => c.color) || []), [composition]);

  // Custom label for Pie Chart
  const pieLabel = useMemo(() => (
    (props) => {
      const {
        cx, cy, midAngle, innerRadius, outerRadius, percent, name, value,
      } = props;
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill="#e5e7eb"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          style={{ fontSize: 12 }}
        >
          {`${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
        </text>
      );
    }
  ), []);

  return (
    <div className="dashboard-grid">
      {/* Line Chart: Waste vs Recycled */}
      <div className="card">
        <div className="card-title">Waste vs Recycled (Monthly)</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="ts" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0b1416', border: '1px solid #1f2937' }} />
            <Legend />
            <Line type="monotone" dataKey="waste" stroke="#f43f5e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="recycled" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart: Organic diversion */}
      <div className="card">
        <div className="card-title">Organic Diversion Trend</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={timeSeries}>
            <defs>
              <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="ts" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0b1416', border: '1px solid #1f2937' }} />
            <Area type="monotone" dataKey="organic" stroke="#22c55e" fill="url(#organic)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Energy recovery */}
      <div className="card">
        <div className="card-title">Energy Recovery</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="ts" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0b1416', border: '1px solid #1f2937' }} />
            <Bar dataKey="energy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Composition */}
      <div className="card">
        <div className="card-title">Waste Composition</div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Tooltip contentStyle={{ background: '#0b1416', border: '1px solid #1f2937' }} />
            <Pie
              data={composition}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={false}
              label={pieLabel}
            >
              {(composition || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart: Department performance */}
      <div className="card">
        <div className="card-title">Department Performance</div>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1f2937" />
            <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
            <PolarRadiusAxis stroke="#9ca3af" />
            <Radar name="Generated" dataKey="generated" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
            <Radar name="Recycled" dataKey="recycled" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Composed Chart: Combined view */}
      <div className="card">
        <div className="card-title">Combined Metrics</div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={timeSeries}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="ts" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0b1416', border: '1px solid #1f2937' }} />
            <Area type="monotone" dataKey="recycled" fill="#22c55e33" stroke="#22c55e" />
            <Bar dataKey="waste" barSize={16} fill="#f43f5e" />
            <Line type="monotone" dataKey="organic" stroke="#16a34a" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Minimal styles scoped to the dashboard
export const dashboardStyles = `
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (min-width: 1200px) {
  .dashboard-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.card {
  background: #0b1416;
  border: 1px solid #1f2937;
  border-radius: 12px;
  padding: 12px 12px 8px;
}
.card-title {
  color: #e5e7eb;
  font-size: 14px;
  margin-bottom: 8px;
}
`;
