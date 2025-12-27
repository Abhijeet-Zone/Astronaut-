import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ===== DATA =====
const missionOverview = {
  totalMissions: 4630,
  successful: 4162,
  failed: 357,
  rockets: 370,
  price: '$162.3K'
};

const missionTrends = [
  { year: 1960, success: 10, failure: 5 },
  { year: 1970, success: 80, failure: 15 },
  { year: 1980, success: 100, failure: 12 },
  { year: 1990, success: 120, failure: 8 },
  { year: 2000, success: 140, failure: 10 },
  { year: 2010, success: 160, failure: 7 },
  { year: 2020, success: 190, failure: 5 },
  { year: 2025, success: 210, failure: 3 }
];

const priceByCompany = [
  { name: 'NASA', value: 50 },
  { name: 'SpaceX', value: 25 },
  { name: 'ULA', value: 10 },
  { name: 'Arianespace', value: 8 },
  { name: 'RVSN USSR', value: 7 }
];

const missionsByCountry = [
  { name: 'Russia', value: 1323 },
  { name: 'USA', value: 1298 },
  { name: 'Kazakhstan', value: 625 },
  { name: 'China', value: 335 },
  { name: 'France', value: 299 }
];

const missionsByCompany = [
  { name: 'RVSN USSR', value: 1614 },
  { name: 'CASC', value: 318 },
  { name: 'Arianespace', value: 282 },
  { name: 'General Dynamics', value: 203 },
  { name: 'VKS RF', value: 202 }
];

const missionsByRocket = [
  { name: 'Cosmos-3M', value: 446 },
  { name: 'Voskhod', value: 299 },
  { name: 'Molniya-M', value: 128 },
  { name: 'Cosmos-2', value: 126 },
  { name: 'Soyuz U', value: 125 }
];

const voyagerData = [
  { year: 1977, distance: 0 },
  { year: 1990, distance: 40 },
  { year: 2005, distance: 80 },
  { year: 2020, distance: 140 },
  { year: 2025, distance: 160 }
];

const futureMissions = [
  { name: 'Voyager', status: 'Active', goal: 'Interstellar data' },
  { name: 'Artemis II', status: 'Planned', goal: 'Crewed lunar orbit 2025' },
  { name: 'Mars Rover 2025', status: 'Planned', goal: 'Soil & oxygen sampling' },
  { name: 'JWST', status: 'Active', goal: 'Deep space observation' }
];

const COLORS = ['#007bff', '#4caf50', '#ff9800', '#e74c3c', '#9b59b6'];

// ===== COMPONENT =====
function SpaceMissionsDashboard() {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full flex flex-col overflow-x-hidden">
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 md:px-16 py-10">
        <h1 className="text-yellow-400 text-4xl font-bold mb-10 text-center tracking-wide">
          🚀 SPACE MISSIONS ANALYTICS
        </h1>

        {/* ===== TOP METRICS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10 text-center">
          {Object.entries(missionOverview).map(([key, val]) => (
            <div
              key={key}
              className="bg-gray-800 rounded-xl py-6 shadow-md hover:shadow-yellow-400/40 transition-all duration-200"
            >
              <p className="uppercase text-gray-400 text-sm">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-3xl font-bold text-yellow-300">{val}</p>
            </div>
          ))}
        </div>

        {/* ===== MAIN CHARTS ===== */}
        <div className="flex flex-col gap-10">
          {/* Mission Trends */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-green-400 text-center">Total Missions by Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={missionTrends}>
                <XAxis dataKey="year" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="success" stroke="#4caf50" strokeWidth={3} />
                <Line type="monotone" dataKey="failure" stroke="#e74c3c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Total Price by Company */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-blue-400 text-center">Total Price by Company</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={priceByCompany} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                  {priceByCompany.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Successful Missions by Country */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400 text-center">Successful Missions by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={missionsByCountry}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#00bcd4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Voyager Mission Progress */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400 text-center">Voyager Mission Distance (AU)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={voyagerData}>
                <XAxis dataKey="year" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="distance" stroke="#f1c40f" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Missions by Company */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-purple-400 text-center">Successful Missions by Company</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={missionsByCompany}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#9b59b6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Missions by Rocket */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-orange-400 text-center">Total Missions by Rocket</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={missionsByRocket}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#ff9800" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Future Missions */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-green-300 text-center">🛰 Current & Future Missions</h3>
            <ul className="space-y-3">
              {futureMissions.map((m, i) => (
                <li key={i} className="bg-gray-700 p-4 rounded-xl">
                  <p className="text-lg font-semibold text-blue-300">{m.name}</p>
                  <p className="text-sm text-gray-300">
                    <strong>Status:</strong> {m.status} | <strong>Goal:</strong> {m.goal}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceMissionsDashboard;