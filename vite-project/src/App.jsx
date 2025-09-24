import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./AllComponents/Sidebar.jsx";
import HealthComponent from "./AllComponents/HealthComponenets/HealtComponent";
import LandingNavigationApp from "./AllComponents/NavigateComponent/NavigateComponent";
import AdvancedDashboard from "./AllComponents/PhysicoComponent/AdvancedDashboard";
import EquipmentComponent from "./AllComponents/EquipmentComponenet/EquipmentComponent";
import Communication from "./AllComponents/ComunicationCoponent/Comunication";
import Home from "./AllComponents/Home.jsx";
import Spavenova from "./AllComponents/SpaveNova/Spavenova.jsx";
import Astrofategue from "./AllComponents/AstronautFategue/Astrofategue.jsx";
import Dashboard from "./AllComponents/Dashboard/Dashboard.jsx";
import Food from './AllComponents/FoodStorage/Food.jsx';

export default function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar can be included here if needed */}

        <div className="p-6 bg-gray-100 min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment" element={<EquipmentComponent />} />
            <Route path="/navigation" element={<LandingNavigationApp />} />
            <Route path="/health" element={<HealthComponent />} />
            <Route path="/physico" element={<AdvancedDashboard />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/spavenova" element={<Spavenova />} />
            <Route path="/Astrofategue" element={<Astrofategue />} />
            <Route path="/FoodStorage" element={<Food />} />
            <Route path="/foodstorage" element={<Food />} />
            <Route path="/food" element={<Food />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
