import React, { useState, useEffect } from 'react';
import "./NavigateComponent.css"
const LandingNavigationApp = () => {
  const [activeTab, setActiveTab] = useState('controls');
  const [reentryData, setReentryData] = useState({
    altitude: 120,
    velocity: 27500,
    heat_shield_temp: 1650,
    g_force: 4.2,
    atmospheric_density: 0.0012,
    distance_to_landing: 2400,
    phase: 'entry'
  });

  const [landingData, setLandingData] = useState({
    parachute_status: 'Armed',
    heat_shield_status: 'Intact',
    navigation_lock: 'Active',
    landing_zone: 'Zone A - Pacific',
    guidance_system: 'Auto-pilot Engaged',
    primary_zone: { name: 'Pacific Ocean - Zone A', lat: 34.5, lon: -120.2, weather: 'Clear', wind: 12 },
    backup_zone: { name: 'Atlantic Ocean - Zone B', lat: 28.4, lon: -80.6, weather: 'Partly Cloudy', wind: 8 }
  });

  const [systemStatus, setSystemStatus] = useState({
    navigationOverride: false,
    emergencyMode: false,
    parachuteDeployed: false,
    heatShieldJettisoned: false,
    manualControl: false
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info', message: 'Re-entry sequence initiated', timestamp: new Date() },
    { id: 2, type: 'warning', message: 'High G-force detected', timestamp: new Date() }
  ]);

  // Button handlers
  const handleNavigationOverride = () => {
    setSystemStatus(prev => ({ ...prev, navigationOverride: !prev.navigationOverride }));
    sendMessage('info', 'Navigation Override', `Navigation override ${systemStatus.navigationOverride ? 'disabled' : 'enabled'}`);
  };

  const handleParachuteDeployment = () => {
    if (!systemStatus.parachuteDeployed) {
      setSystemStatus(prev => ({ ...prev, parachuteDeployed: true }));
      setLandingData(prev => ({ ...prev, parachute_status: 'Deployed' }));
      sendMessage('success', 'Deploy Main Parachute', 'Main parachute deployed successfully');
    }
  };

  const handleHeatShieldJettison = () => {
    if (!systemStatus.heatShieldJettisoned) {
      setSystemStatus(prev => ({ ...prev, heatShieldJettisoned: true }));
      setLandingData(prev => ({ ...prev, heat_shield_status: 'Jettisoned' }));
      sendMessage('warning', 'Jettison Heat Shield', 'Heat shield jettisoned');
    }
  };

  const handleEmergencyProtocol = (protocol) => {
    setSystemStatus(prev => ({ ...prev, emergencyMode: true }));
    sendMessage('danger', 'Emergency Protocol', `Emergency protocol activated: ${protocol}`);
  };

  const addAlert = (type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only last 10 alerts
  };

  // Unified message sender for all UI button interactions
  const sendMessage = (type, source, message) => {
    const composed = `[${source}] ${message}`;
    addAlert(type, composed);
  };

  // Simulate real-time re-entry data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setReentryData(prev => {
        const newAltitude = Math.max(0, prev.altitude - 0.5);
        const newVelocity = Math.max(0, prev.velocity - 0.02);
        let newPhase = prev.phase;
        
        if (newAltitude < 100 && newPhase === 'pre-entry') newPhase = 'entry';
        if (newAltitude < 50 && newPhase === 'entry') newPhase = 'descent';
        if (newAltitude < 10 && newPhase === 'descent') newPhase = 'landing';
        
        return {
          ...prev,
          altitude: newAltitude,
          velocity: newVelocity,
          phase: newPhase,
          heat_shield_temp: Math.max(200, prev.heat_shield_temp - 10),
          atmospheric_density: Math.min(1.225, prev.atmospheric_density + 0.01),
          g_force: newAltitude > 50 ? prev.g_force + 0.1 : Math.max(1, prev.g_force - 0.2),
          distance_to_landing: Math.max(0, prev.distance_to_landing - 20)
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const StatusCard = ({ title, value, unit, icon, status = 'normal' }) => (
    <div className={`status-card ${
      status === 'warning' ? 'status-card-warning' :
      status === 'critical' ? 'status-card-critical' :
      'status-card-normal'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className={`text-2xl ${
          status === 'warning' ? 'animate-pulse' :
          status === 'critical' ? 'animate-bounce' :
          ''
        }`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900">
        {value} {unit ? (<span className="text-lg font-normal text-gray-600">{unit}</span>) : null}
      </div>
      {status === 'critical' && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );

  const ReentryDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard title="Altitude" value={reentryData.altitude.toLocaleString()} unit="km" status="normal" />
        <StatusCard title="Velocity" value={reentryData.velocity.toLocaleString()} unit="km/h" status={reentryData.velocity > 25000 ? 'critical' : 'normal'} />
        <StatusCard title="Heat Shield Temp" value={reentryData.heat_shield_temp} unit="°C" status={reentryData.heat_shield_temp > 1500 ? 'warning' : 'normal'} />
        <StatusCard title="G-Force" value={reentryData.g_force} unit="g" status={reentryData.g_force > 8 ? 'critical' : 'normal'} />
        <StatusCard title="Atmospheric Density" value={reentryData.atmospheric_density} unit="kg/m³" status="normal" />
        <StatusCard title="Mission Phase" value={reentryData.phase} status={reentryData.phase === 'entry' ? 'warning' : 'normal'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Re-entry Visualization */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center">
            🌍 Re-entry Trajectory
          </h3>
          <div className="relative h-80 bg-gradient-to-b from-indigo-100 via-purple-100 to-white rounded-xl overflow-hidden border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Particle background */}
              <div className="particles">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>
              {/* Earth */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl border-4 border-green-400 relative">
                <div className="absolute top-3 left-4 w-3 h-3 bg-green-300 rounded-full opacity-80"></div>
                <div className="absolute bottom-4 right-3 w-4 h-2 bg-green-300 rounded opacity-70"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10"></div>
              </div>
              {/* Spacecraft with enhanced heat trail */}
              <div className={`absolute w-4 h-4 rounded-full shadow-2xl transition-all duration-1000 ${
                reentryData.phase === 'entry' ? 'bg-gradient-to-r from-red-500 to-orange-400 animate-pulse' : 'bg-gradient-to-r from-white to-blue-200'
              }`} style={{
                top: `${Math.max(10, reentryData.altitude)}%`,
                right: `${Math.max(20, 100 - reentryData.distance_to_landing / 50)}%`
              }}>
                {reentryData.phase === 'entry' && (
                  <>
                    <div className="absolute -left-12 top-0 w-12 h-2 bg-gradient-to-l from-red-500 via-orange-400 to-transparent animate-pulse"></div>
                    <div className="absolute -left-8 top-1 w-8 h-1 bg-gradient-to-l from-yellow-400 to-transparent"></div>
                  </>
                )}
                <div className="absolute inset-0 rounded-full animate-ping bg-white/50"></div>
              </div>
              {/* Enhanced atmosphere layers */}
              <div className="absolute w-28 h-28 border-2 border-blue-300/30 rounded-full animate-pulse"></div>
              <div className="absolute w-32 h-32 border border-blue-400/20 rounded-full"></div>
              <div className="absolute w-36 h-36 border border-purple-400/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Landing Zone Status */}
        <div className="glass-card rounded-xl p-6 w-full lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
            🎯 Landing Zone Status
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-xl backdrop-blur-sm">
              <div className="font-bold text-green-800 text-lg">Primary Zone: {landingData.primary_zone.name}</div>
              <div className="text-sm text-green-700 mt-2">
                🌤️ Weather: {landingData.primary_zone.weather} | 💨 Wind: {landingData.primary_zone.wind} knots
              </div>
              <div className="text-xs text-green-700 mt-1">
                📍 Coordinates: {landingData.primary_zone.lat}°, {landingData.primary_zone.lon}°
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-xl backdrop-blur-sm">
              <div className="font-bold text-blue-800 text-lg">Backup Zone: {landingData.backup_zone.name}</div>
              <div className="text-sm text-blue-700 mt-2">
                🌤️ Weather: {landingData.backup_zone.weather} | 💨 Wind: {landingData.backup_zone.wind} knots
              </div>
            </div>
            <div className="pt-4">
              <div className="text-sm text-gray-700 mb-3 font-semibold">Landing Progress</div>
              <div className="progress-track">
                <div className="progress-fill" 
                     style={{ width: `${Math.max(0, 100 - (reentryData.distance_to_landing / 2400 * 100))}%` }}></div>
              </div>
              <div className="text-sm text-gray-700 mt-2 flex justify-between">
                <span>Distance: {reentryData.distance_to_landing.toFixed(0)} km</span>
                <span>{Math.max(0, 100 - (reentryData.distance_to_landing / 2400 * 100)).toFixed(1)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Status */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center text-white">
          🚀 Mission Phase: <span className="ml-2 text-cyan-400">{reentryData.phase.toUpperCase()}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl text-center transition-all duration-500 ${
            reentryData.phase === 'pre-entry' 
              ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-lg shadow-blue-200 scale-105' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-2">🛰️</div>
            <div className="font-bold text-gray-900">Pre-Entry</div>
            <div className="text-sm text-gray-600">Preparing for atmosphere</div>
          </div>
          <div className={`p-4 rounded-xl text-center transition-all duration-500 ${
            reentryData.phase === 'entry' 
              ? 'bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-300 shadow-lg shadow-red-200 scale-105 animate-pulse' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-2">🔥</div>
            <div className="font-bold text-gray-900">Entry</div>
            <div className="text-sm text-gray-600">Atmospheric heating</div>
          </div>
          <div className={`p-4 rounded-xl text-center transition-all duration-500 ${
            reentryData.phase === 'descent' 
              ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-300 shadow-lg shadow-yellow-200 scale-105' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-2">🪂</div>
            <div className="font-bold text-gray-900">Descent</div>
            <div className="text-sm text-gray-600">Parachute deployment</div>
          </div>
          <div className={`p-4 rounded-xl text-center transition-all duration-500 ${
            reentryData.phase === 'landing' 
              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 shadow-lg shadow-green-200 scale-105' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold text-gray-900">Landing</div>
            <div className="text-sm text-gray-600">Final approach</div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
          ⚠️ System Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'critical' ? 'bg-red-50 border-red-400 animate-pulse' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-900">{alert.message}</span>
                <span className="text-xs text-gray-600 ml-4">{alert.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LandingControls = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">🎮 Landing Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Navigation Override */}
          <div className="space-y-6 h-full">
            <h4 className="text-xl font-bold text-gray-900 mb-4">🧭 Navigation Override</h4>
            <div className="flex flex-wrap space-x-2">
              <button 
                className={`btn-primary ${systemStatus.navigationOverride ? 'opacity-75' : ''}`}
                onClick={handleNavigationOverride}
              >
                📍 {systemStatus.navigationOverride ? 'Disable Manual Control' : 'Enable Manual Control'}
              </button>
              <button 
                className="btn-nav"
                onClick={() => sendMessage('info', 'Target Landing Zone', 'Landing zone targeting system activated')}
              >
                🎯 Target Landing Zone
              </button>
              <button 
                className={`btn-warning ${systemStatus.navigationOverride ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !systemStatus.navigationOverride && sendMessage('warning', 'Override Autopilot', 'Autopilot override engaged')}
                disabled={systemStatus.navigationOverride}
              >
                ⚠️ Override Autopilot
              </button>
            </div>
          </div>
          {/* Landing System Controls */}
          <div className="space-y-6 h-full">
            <h4 className="text-xl font-bold text-gray-900 mb-4">🚁 Landing Systems</h4>
            <div className="flex flex-wrap space-x-2">
              <button 
                className={`btn-success ${systemStatus.parachuteDeployed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleParachuteDeployment}
                disabled={systemStatus.parachuteDeployed}
              >
                🪂 {systemStatus.parachuteDeployed ? 'Parachute Deployed' : 'Deploy Main Parachute'}
              </button>
              <button 
                className={`btn-danger ${systemStatus.heatShieldJettisoned ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleHeatShieldJettison}
                disabled={systemStatus.heatShieldJettisoned}
              >
                🔥 {systemStatus.heatShieldJettisoned ? 'Heat Shield Jettisoned' : 'Jettison Heat Shield'}
              </button>
              <button 
                className="btn-emergency"
                onClick={() => handleEmergencyProtocol('Emergency Landing')}
              >
                🚨 Emergency Landing Protocol
              </button>
            </div>
          </div>
        </div>

        {/* System Status and Alerts (horizontal on large screens) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="grid grid-cols-3 gap-6 items-stretch">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="font-bold text-green-800 text-lg">🛡️ Heat Shield</div>
              <div className="text-base font-bold text-green-700 mt-1">{landingData.heat_shield_status}</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="font-bold text-blue-800 text-lg">🪂 Parachute System</div>
              <div className="text-base font-bold text-blue-700 mt-1">{landingData.parachute_status}</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="font-bold text-purple-800 text-lg">🧭 Guidance System</div>
              <div className="text-base font-bold text-purple-700 mt-1">{landingData.guidance_system}</div>
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">📢 System Alerts</h4>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-chip ${
                  alert.type === 'success' ? 'alert-success' :
                  alert.type === 'warning' ? 'alert-warning' :
                  alert.type === 'danger' ? 'alert-danger' :
                  'alert-info'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <span>{alert.message}</span>
                    <span className="text-xs opacity-75 whitespace-nowrap">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmergencyProtocols = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
          🚨 Emergency Landing Protocols
        </h3>
        
        <div className="space-y-6">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <h4 className="font-bold text-red-800 mb-4 text-xl">⚡ Critical System Failures</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold text-lg">Navigation System Loss:</span>
                <button 
                  className="btn-danger px-4 py-2 text-sm"
                  onClick={() => handleEmergencyProtocol('Navigation Backup Activated')}
                >
                  Activate Backup
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold text-lg">Heat Shield Failure:</span>
                <button 
                  className="btn-emergency px-4 py-2 text-sm"
                  onClick={() => handleEmergencyProtocol('Emergency Abort Sequence')}
                >
                  Emergency Abort
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold text-lg">Parachute Malfunction:</span>
                <button 
                  className="btn-danger px-4 py-2 text-sm"
                  onClick={() => handleEmergencyProtocol('Backup Parachute Deployed')}
                >
                  Deploy Backup
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-bold text-blue-800 mb-4 text-lg">🌍 Backup Landing Zones</h4>
              <div className="grid grid-cols-2 gap-3 items-stretch">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="font-bold text-gray-900">Zone C - Indian Ocean</div>
                  <div className="text-gray-600 text-sm">📍 Distance: 890 km | 🌤️ Weather: Fair</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="font-bold text-gray-900">Zone D - Mediterranean</div>
                  <div className="text-gray-600 text-sm">📍 Distance: 1240 km | ☀️ Weather: Clear</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl">
              <h4 className="font-bold text-purple-800 mb-4 text-xl">📡 Communication Protocols</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="md:w-auto btn-primary"
                  onClick={() => sendMessage('info', 'Emergency Beacon', 'Emergency beacon activated')}
                >
                  📡 Emergency Beacon
                </button>
                <button 
                  className="md:w-auto btn-success"
                  onClick={() => sendMessage('success', 'Ground Control Link', 'Ground control link established')}
                >
                  📞 Ground Control Link
                </button>
                <button 
                  className="md:w-auto btn-warning"
                  onClick={() => sendMessage('info', 'Satellite Uplink', 'Satellite uplink connecting...')}
                >
                  🛰️ Satellite Uplink
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h4 className="font-bold text-yellow-800 mb-6 text-3xl">🧭 Navigation Backup Systems</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">🧭</div>
                <div className="font-bold text-gray-900">Inertial Navigation</div>
                <div className="text-sm text-green-600 mt-2">✅ Active</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">🛰️</div>
                <div className="font-bold text-gray-900">GPS Backup</div>
                <div className="text-sm text-yellow-600 mt-2">⏳ Standby</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">⭐</div>
                <div className="font-bold text-gray-900">Star Tracker</div>
                <div className="text-sm text-blue-600 mt-2">🔄 Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen scene-3d">
      {/* Header */}
      <div className="nav-space shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-4xl mr-4 floating">🚀</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Earth Landing Navigation System</h1>
                <p className="text-lg text-gray-600">Safe Re-entry & Landing Control Interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">Mission Phase</div>
                <div className={`text-lg font-bold ${
                  reentryData.phase === 'pre-entry' ? 'text-blue-600' :
                  reentryData.phase === 'entry' ? 'text-red-600' :
                  reentryData.phase === 'descent' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{reentryData.phase.toUpperCase()}</div>
              </div>
              <div className={`w-4 h-4 rounded-full animate-pulse shadow-lg ${
                reentryData.phase === 'entry' ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-space border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2">
            {[
              { id: 'reentry', label: 'Re-entry Dashboard', icon: '🌍' },
              { id: 'controls', label: 'Landing Controls', icon: '🎮' },
              { id: 'emergency', label: 'Emergency Protocols', icon: '🚨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  sendMessage('info', 'Tabs', `Switched to ${tab.label}`);
                }}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reentry' && <ReentryDashboard />}
        {activeTab === 'controls' && <LandingControls />}
        {activeTab === 'emergency' && <EmergencyProtocols />}
      </div>
    </div>
  );
};

export default LandingNavigationApp;