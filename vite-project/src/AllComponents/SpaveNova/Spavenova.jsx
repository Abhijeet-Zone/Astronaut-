import React, { useState } from 'react';


import BackgroundVideo from './BackgroundVideo';
import Header from './Header';
import DashboardTab from './DashboardTab';
import SolarSystemTab from './SolarSystemTab';
import VoiceAITab from './VoiceAITab';
import ChatTab from './ChatTab';
import DataVizTab from './DataVizTab';
import GalleryTab from './GalleryTab';
import "./SpaveNova.css";

function Spavenova() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'solar-system':
        return <SolarSystemTab />;
      case 'voice-ai':
        return <VoiceAITab />;
      case 'chat':
        return <ChatTab />;
      case 'data-viz':
        return <DataVizTab />;
      case 'gallery':
        return <GalleryTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <>
      <BackgroundVideo />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-area">
        {renderTabContent()}
      </div>
    </>
  );
}

export default Spavenova;